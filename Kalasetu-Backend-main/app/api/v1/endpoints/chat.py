import json
from typing import List, Dict, Set
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db, AsyncSessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat import ChatThread, ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageOut, ChatThreadOut
from app.services.bhashini import bhashini_service

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, thread_id: str, websocket: WebSocket):
        await websocket.accept()
        if thread_id not in self.active_connections:
            self.active_connections[thread_id] = set()
        self.active_connections[thread_id].add(websocket)

    def disconnect(self, thread_id: str, websocket: WebSocket):
        if thread_id in self.active_connections:
            self.active_connections[thread_id].remove(websocket)
            if not self.active_connections[thread_id]:
                del self.active_connections[thread_id]

    async def broadcast(self, thread_id: str, message_data: dict):
        if thread_id in self.active_connections:
            for connection in self.active_connections[thread_id]:
                await connection.send_json(message_data)


manager = ConnectionManager()


@router.get("/threads", response_model=List[ChatThreadOut])
async def get_my_chat_threads(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unified Inbox containing:
    - Product quotation chats
    - Tender chats
    - Active order conversations
    """
    stmt = select(ChatThread).where(
        or_(ChatThread.artisan_id == current_user.id, ChatThread.buyer_id == current_user.id)
    ).order_by(ChatThread.updated_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/threads/{thread_id}/messages", response_model=List[ChatMessageOut])
async def get_thread_messages(
    thread_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatMessage).where(ChatMessage.thread_id == thread_id).order_by(ChatMessage.created_at.asc())
    )
    return result.scalars().all()


@router.post("/messages", response_model=ChatMessageOut)
async def send_chat_message(
    payload: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Sends message via REST API and broadcasts via WebSocket.
    """
    t_res = await db.execute(select(ChatThread).where(ChatThread.id == payload.thread_id))
    thread = t_res.scalar_one_or_none()
    if not thread:
        raise HTTPException(status_code=404, detail="Chat thread not found.")

    # Translate message
    recip_lang = "en" if current_user.preferred_language == "hi" else "hi"
    translated = await bhashini_service.translate_text(
        payload.message_text,
        source_lang=current_user.preferred_language,
        target_lang=recip_lang
    )

    msg = ChatMessage(
        thread_id=payload.thread_id,
        sender_id=current_user.id,
        message_text=payload.message_text,
        attachment_url=payload.attachment_url,
        translated_text=json.dumps({recip_lang: translated})
    )
    db.add(msg)
    await db.commit()

    res = await db.execute(select(ChatMessage).where(ChatMessage.id == msg.id))
    saved_msg = res.scalar_one()

    # Broadcast JSON via WebSocket manager
    msg_dict = {
        "id": saved_msg.id,
        "thread_id": saved_msg.thread_id,
        "sender_id": saved_msg.sender_id,
        "message_text": saved_msg.message_text,
        "translated_text": saved_msg.translated_text,
        "created_at": saved_msg.created_at.isoformat()
    }
    await manager.broadcast(payload.thread_id, msg_dict)

    return saved_msg


@router.websocket("/ws/{thread_id}")
async def websocket_chat_endpoint(websocket: WebSocket, thread_id: str):
    """
    Real-time WebSocket endpoint for multilingual chat.
    """
    await manager.connect(thread_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            async with AsyncSessionLocal() as session:
                msg = ChatMessage(
                    thread_id=thread_id,
                    sender_id=payload.get("sender_id", "anonymous"),
                    message_text=payload.get("message_text", ""),
                    attachment_url=payload.get("attachment_url")
                )
                session.add(msg)
                await session.commit()

                out_payload = {
                    "id": msg.id,
                    "thread_id": thread_id,
                    "sender_id": msg.sender_id,
                    "message_text": msg.message_text,
                    "created_at": msg.created_at.isoformat()
                }
                await manager.broadcast(thread_id, out_payload)

    except WebSocketDisconnect:
        manager.disconnect(thread_id, websocket)
