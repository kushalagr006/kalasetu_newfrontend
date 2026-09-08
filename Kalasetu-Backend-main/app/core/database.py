from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Determine database engine URL
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    engine = create_async_engine(
        db_url,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    engine = create_async_engine(
        db_url,
        pool_pre_ping=True,
        echo=False
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        if db_url.startswith("sqlite"):
            def migrate_sqlite(sync_conn):
                import sqlite3
                raw_conn = sync_conn.connection
                cursor = raw_conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
                tables = [row[0] for row in cursor.fetchall()]
                if "products" in tables:
                    cursor.execute("PRAGMA table_info(products)")
                    cols = [row[1] for row in cursor.fetchall()]
                    missing = {
                        "title_en": "VARCHAR(255)",
                        "description_en": "TEXT",
                        "category_en": "VARCHAR(100)",
                        "material_used_en": "VARCHAR(100)",
                        "source_language": "VARCHAR(10)",
                        "translations_json": "TEXT"
                    }
                    for col, dtype in missing.items():
                        if col not in cols:
                            cursor.execute(f"ALTER TABLE products ADD COLUMN {col} {dtype}")
                raw_conn.commit()
            await conn.run_sync(migrate_sqlite)
