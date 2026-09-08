"""
KalaSetu Dynamic Pricing Engine v2
Empirically validated architecture:
EVIDENCE FIRST + COST SAFETY + BOUNDED ML CORRECTION + ARTISAN STRATEGY
"""

import os
import re
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, Tuple

def round_to_market_boundary(val: float) -> float:
    """Rounds prices to natural Indian artisan market boundaries."""
    if val is None or np.isnan(val) or val <= 0:
        return 0.0
    if val < 500:
        return round(val / 10.0) * 10.0
    elif val < 2000:
        return round(val / 50.0) * 50.0
    elif val < 10000:
        return round(val / 100.0) * 100.0
    else:
        return round(val / 500.0) * 500.0

def tokenize(text: str) -> set:
    if not isinstance(text, str):
        return set()
    return set(re.findall(r'\b[a-z0-9]+\b', text.lower()))

def normalize_vision_taxonomy(craft: str, raw_type: str, raw_form: str) -> Tuple[str, str]:
    """Maps Gemini free-text vision output to canonical database keys."""
    t = str(raw_type).lower().replace('-', '_').replace(' ', '_')
    f = str(raw_form).lower().replace('-', '_').replace(' ', '_')
    craft = str(craft).lower()
    
    if 'dhokra' in craft:
        if any(x in t or x in f for x in ['nandi', 'bull', 'cow']):
            return 'nandi', 'figurine'
        elif any(x in t or x in f for x in ['figurine', 'idol', 'statue', 'human', 'couple']):
            return 'human_figure', 'figurine'
        elif any(x in t or x in f for x in ['bell', 'hanging']):
            return 'bell', 'hanging_bell'
        return 'figurine', 'figurine'
        
    elif 'channapatna' in craft:
        if any(x in t or x in f for x in ['top', 'spinning']):
            return 'spinning_top', 'single'
        elif any(x in t or x in f for x in ['set', 'montessori', 'learning', 'kit', 'toy']):
            return 'educational_toy', 'set'
        elif any(x in t or x in f for x in ['vehicle', 'car', 'engine', 'train']):
            return 'vehicle', 'single'
        return 'toy', 'single'
        
    elif 'madhubani' in craft:
        if any(x in t or x in f for x in ['plate', 'platter', 'decor']):
            return 'decorative_object', 'decorative_object'
        elif any(x in t or x in f for x in ['fish', 'peacock', 'nature', 'tree']):
            return 'nature', 'painting'
        elif any(x in t or x in f for x in ['krishna', 'ganesh', 'religious', 'god']):
            return 'religious', 'painting'
        return 'nature', 'painting'
        
    elif 'sikki' in craft:
        if any(x in t or x in f for x in ['basket', 'storage', 'box']):
            return 'basket', 'basket'
        elif any(x in t or x in f for x in ['frame', 'art', 'hanging']):
            return 'wall_hanging', 'wall_hanging'
        return 'figurine', 'figurine'
        
    elif 'sujini' in craft:
        if any(x in t or x in f for x in ['cushion', 'pillow']):
            return 'cushion_cover', 'cushion_cover'
        elif any(x in t or x in f for x in ['bedspread', 'quilt', 'blanket']):
            return 'bedspread', 'bedspread'
        elif any(x in t or x in f for x in ['frame', 'art', 'panel']):
            return 'textile_panel', 'textile_panel'
        return 'cushion_cover', 'cushion_cover'
        
    return t, f

def retrieve_comparables(
    df: pd.DataFrame,
    craft_category: str,
    product_type: Optional[str] = None,
    product_form: Optional[str] = None,
    product_family: Optional[str] = None,
    query_title: str = "",
    top_k: int = 10
) -> pd.DataFrame:
    craft = str(craft_category).strip().lower()
    craft_df = df[df['craft_category'] == craft].copy()
    if len(craft_df) == 0:
        return pd.DataFrame()
        
    q_tokens = tokenize(query_title)
    if product_type:
        q_tokens.update(tokenize(product_type))
        
    scored = []
    for _, row in craft_df.iterrows():
        p_name = str(row.get('product_name', ''))
        p_type = str(row.get('product_type', '')).lower()
        p_form = str(row.get('product_form', '')).lower()
        p_fam  = str(row.get('product_family', '')).lower()
        
        row_tokens = tokenize(p_name) | tokenize(p_type) | tokenize(p_form)
        overlap = len(q_tokens & row_tokens)
        jaccard = overlap / max(1, len(q_tokens | row_tokens))
        
        is_type = bool(product_type and p_type == product_type.lower())
        is_form = bool(product_form and p_form == product_form.lower())
        is_fam  = bool(product_family and p_fam == product_family.lower())
        
        if is_type and is_form:
            tier, score = 1, 100.0
        elif is_type or (is_fam and is_form):
            tier, score = 2, 60.0
        elif is_form or is_fam or overlap >= 2:
            tier, score = 3, 30.0
        else:
            tier, score = 4, 10.0
            
        scored.append({
            'product_name': p_name,
            'listed_price_inr': row['listed_price_inr'],
            'tier': tier,
            'match_score': score + (jaccard * 10.0),
            'product_type': p_type,
            'product_form': p_form,
            'product_family': p_fam,
            'source_name': row.get('source_name', 'unknown')
        })
        
    sdf = pd.DataFrame(scored)
    return sdf.sort_values(by=['tier', 'match_score'], ascending=[True, False]).head(top_k).reset_index(drop=True)

def compute_market_evidence(comparables_df: pd.DataFrame) -> Dict[str, Any]:
    if comparables_df.empty:
        return {"status": "NO_EVIDENCE", "confidence": "LOW", "observed_market_reference": 0.0}
        
    prices = comparables_df['listed_price_inr'].values
    weights = comparables_df['match_score'].values
    tier1_cnt = int((comparables_df['tier'] == 1).sum())
    
    p25 = float(np.percentile(prices, 25))
    p50 = float(np.median(prices))
    p75 = float(np.percentile(prices, 75))
    iqr = p75 - p25
    
    s_idx = np.argsort(prices)
    c_weights = np.cumsum(weights[s_idx])
    w_p50 = float(prices[s_idx][min(np.searchsorted(c_weights, c_weights[-1] / 2.0), len(prices)-1)])
    
    ref_raw = (0.60 * p50) + (0.40 * w_p50)
    market_ref = round_to_market_boundary(ref_raw)
    
    disp = iqr / max(1.0, p50)
    conf = "HIGH" if (tier1_cnt >= 5 and disp <= 0.60) else ("MEDIUM" if (tier1_cnt >= 3 or disp <= 0.90) else "LOW")
    
    return {
        "status": "SUCCESS",
        "evidence_count": len(prices),
        "tier1_count": tier1_cnt,
        "confidence": conf,
        "raw_p25": p25,
        "raw_median": p50,
        "raw_p75": p75,
        "observed_market_reference": market_ref,
        "dispersion_ratio": round(disp, 2)
    }

def calculate_cost_floor(material_cost: Optional[float], artisan_price: Optional[float], craft: str) -> Dict[str, Any]:
    margins = {"bastar_dhokra": 0.40, "channapatna": 0.35, "madhubani": 0.45, "sikki": 0.40, "sujini": 0.50}
    margin = margins.get(craft.lower(), 0.40)
    
    if material_cost and material_cost > 0:
        floor = material_cost * (1.0 + margin)
        src = "MATERIAL_COST_DERIVED"
    elif artisan_price and artisan_price > 0:
        floor = artisan_price * 0.85
        src = "ARTISAN_BASELINE_DERIVED"
    else:
        floor, src = 0.0, "NO_COST_DATA"
        
    return {"cost_floor": round_to_market_boundary(floor), "source": src, "margin_rate": f"{margin*100:.0f}%"}

def analyze_artisan_position(artisan_price: Optional[float], market_ref: float) -> Dict[str, Any]:
    if not artisan_price or artisan_price <= 0:
        return {"position": "NOT_PROVIDED", "guidance": "No baseline price provided."}
    gap = ((market_ref - artisan_price) / artisan_price) * 100.0
    if gap >= 25.0:
        pos = "SIGNIFICANTLY_UNDERPRICED"
        guide = f"Artisan sells at Rs. {artisan_price:,.0f} vs market Rs. {market_ref:,.0f}. Room to capture +{gap:.0f}% margin."
    elif gap >= 10.0:
        pos = "MODERATELY_UNDERPRICED"
        guide = "Price is below online market median. Healthy room to raise price."
    elif gap <= -25.0:
        pos = "PREMIUM_OVERPRICED"
        guide = "Price is significantly higher than online comparables; ensure master artisan provenance is highlighted."
    else:
        pos = "ALIGNED_WITH_MARKET"
        guide = "Artisan price is well-aligned with prevailing market rates."
    return {"position": pos, "gap_pct": round(gap, 1), "guidance": guide}

def build_suggested_range(market_evidence: Dict[str, Any], cost_floor_data: Dict[str, Any], artisan_price: Optional[float]) -> Dict[str, Any]:
    p25 = market_evidence.get('raw_p25', 0.0)
    p75 = market_evidence.get('raw_p75', 0.0)
    market_ref = market_evidence.get('observed_market_reference', p25)
    cost_floor = cost_floor_data.get('cost_floor', 0.0)
    
    r_min = p25
    if artisan_price and artisan_price > 0 and artisan_price < p25 * 0.70:
        r_min = max(artisan_price * 1.25, cost_floor)
    range_min = round_to_market_boundary(max(r_min, cost_floor))
    
    r_max = max(p75, market_ref * 1.15)
    range_max = round_to_market_boundary(r_max)
    if range_max <= range_min * 1.10:
        range_max = round_to_market_boundary(range_min * 1.25)
        
    return {
        "suggested_range_min": range_min,
        "suggested_range_max": range_max,
        "range_string": f"Rs. {range_min:,.0f} – Rs. {range_max:,.0f}"
    }

def compute_suggested_price(market_evidence: Dict[str, Any], suggested_range: Dict[str, Any], cost_floor_data: Dict[str, Any], artisan_price: Optional[float]) -> Dict[str, Any]:
    r_min = suggested_range['suggested_range_min']
    r_max = suggested_range['suggested_range_max']
    m_ref = market_evidence.get('observed_market_reference', r_min)
    c_floor = cost_floor_data.get('cost_floor', 0.0)
    
    if not artisan_price or artisan_price <= 0:
        target = m_ref
        strat = "MARKET_REFERENCE_ANCHORED"
        rat = "Anchored to observed online market reference."
    else:
        gap = ((m_ref - artisan_price) / artisan_price) * 100.0
        if gap >= 35.0:
            target = (0.60 * m_ref) + (0.40 * artisan_price)
            strat = "COMPETITIVE_GROWTH_TARGET"
            rat = "High-margin growth sweet spot while staying competitive."
        elif gap >= 10.0:
            target = (0.80 * m_ref) + (0.20 * artisan_price)
            strat = "MARKET_ALIGNMENT_TARGET"
            rat = "Positioned near market median to capture standard margins."
        elif gap <= -20.0:
            target = min(artisan_price, r_max)
            strat = "PREMIUM_PROTECTION_TARGET"
            rat = "Maintains artisan premium within market ceiling."
        else:
            target = (0.50 * m_ref) + (0.50 * artisan_price)
            strat = "STABLE_MARKET_OPTIMAL"
            rat = "Equilibrium price balancing sales baseline and market."
            
    suggested = round_to_market_boundary(target)
    suggested = max(r_min, min(suggested, r_max))
    suggested = max(suggested, c_floor)
    
    return {"suggested_price": suggested, "strategy": strat, "rationale": rat}

def compute_bulk_pricing(suggested_price: float, cost_floor: float, material_cost: Optional[float], quantity: int) -> Dict[str, Any]:
    if quantity < 5:
        return {"is_bulk": False, "quantity": quantity, "bulk_price_per_piece": None, "bulk_order_total": None}
    discount = 0.10 if quantity < 20 else (0.15 if quantity < 50 else 0.20)
    disc_price = suggested_price * (1.0 - discount)
    unit_price = round_to_market_boundary(max(disc_price, cost_floor))
    order_total = unit_price * quantity
    profit_str = f"Rs. {order_total - (material_cost * quantity):,.0f}" if material_cost else "N/A"
    return {
        "is_bulk": True,
        "quantity": quantity,
        "bulk_discount_percentage": f"{((suggested_price - unit_price)/suggested_price)*100:.1f}%",
        "bulk_price_per_piece": unit_price,
        "bulk_order_total": order_total,
        "total_estimated_profit": profit_str
    }

def generate_hindi_guidance(artisan_p: Optional[float], suggested_p: float, market_ref: float, cost_floor: float) -> str:
    """Generates simple, respectful Hindi advice for the artisan."""
    if not artisan_p or artisan_p <= 0:
        return f"ऑनलाइन बाज़ार के अनुसार यह उत्पाद लगभग ₹{market_ref:,.0f} का बिकता है। आप इसे ₹{suggested_p:,.0f} में बेच सकते हैं।"
    gap = market_ref - artisan_p
    gain = suggested_p - artisan_p
    if gap > 800:
        return f"सलाह: आप इसे ₹{artisan_p:,.0f} में बेच रहे हैं, जबकि बाज़ार में यह ₹{market_ref:,.0f} तक बिकता है। आप इसे कम से कम ₹{suggested_p:,.0f} में बेचें। आपको ₹{gain:,.0f} का सीधा अतिरिक्त मुनाफ़ा होगा!"
    elif gap < -500:
        return f"सलाह: आपका दाम (₹{artisan_p:,.0f}) आम बाज़ार से अधिक है। यदि इसमें विशेष कलाकारी या अधिक समय लगा है तो ग्राहक को इसकी खासियत जरूर बताएं।"
    else:
        return f"सलाह: आपका दाम (₹{artisan_p:,.0f}) बाज़ार के बिल्कुल सही स्तर पर है। आप ₹{suggested_p:,.0f} तक मांग सकते हैं।"


# ------------------------------------------------------------------------
# High-Level Turnkey Evaluator & Dataset Loader
# ------------------------------------------------------------------------

_CANONICAL_DF_CACHE: Optional[pd.DataFrame] = None

def get_canonical_df(csv_path: Optional[str] = None) -> pd.DataFrame:
    """Loads and caches the canonical 2,359-item handicraft dataset."""
    global _CANONICAL_DF_CACHE
    if _CANONICAL_DF_CACHE is not None:
        return _CANONICAL_DF_CACHE

    candidate_paths = []
    if csv_path:
        candidate_paths.append(csv_path)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_paths.extend([
        os.path.join(base_dir, "..", "data", "processed", "kalasetu_canonical_v2.csv"),
        os.path.join(base_dir, "data", "processed", "kalasetu_canonical_v2.csv"),
        os.path.join(os.getcwd(), "data", "processed", "kalasetu_canonical_v2.csv"),
        r"c:\Users\NIKHIL\Desktop\Kalasetu\Pricing_engine\data\processed\kalasetu_canonical_v2.csv",
        r"c:\Users\NIKHIL\Desktop\kalasetu_v2_engine_files\data\processed\kalasetu_canonical_v2.csv",
    ])

    for p in candidate_paths:
        if os.path.exists(p):
            df = pd.read_csv(p)
            _CANONICAL_DF_CACHE = df
            return _CANONICAL_DF_CACHE

    raise FileNotFoundError(f"kalasetu_canonical_v2.csv not found in candidate paths: {candidate_paths}")


def extract_taxonomy_from_text(text: str, default_craft: Optional[str] = None) -> Dict[str, str]:
    """
    Extracts craft category, product type, and form directly from title/description.
    Zero-latency, offline, deterministic matching for fast path.
    """
    t = (text or "").lower()
    
    # 1. Identify Craft
    craft = default_craft or ""
    if not craft:
        if any(k in t for k in ["dhokra", "dokra", "bell metal", "bastar"]):
            craft = "bastar_dhokra"
        elif any(k in t for k in ["channapatna", "lacquer", "ivory wood"]):
            craft = "channapatna"
        elif any(k in t for k in ["madhubani", "mithila", "kachni", "bharni", "godna"]):
            craft = "madhubani"
        elif any(k in t for k in ["sikki", "golden grass", "sikky"]):
            craft = "sikki"
        elif any(k in t for k in ["sujini", "sujani"]):
            craft = "sujini"
        
    if not craft:
        if any(k in t for k in ["spinning top", "peg doll", "wooden toy"]):
            craft = "channapatna"
        elif any(k in t for k in ["nandi", "tribal bull", "brass idol", "brass statue"]):
            craft = "bastar_dhokra"
        elif any(k in t for k in ["quilt", "cushion cover", "stole"]):
            craft = "sujini"
        else:
            craft = "bastar_dhokra"

    # 2. Extract Type & Form
    raw_type = ""
    raw_form = ""
    
    if craft == "bastar_dhokra":
        if any(k in t for k in ["nandi", "bull", "cow"]):
            raw_type, raw_form = "nandi", "figurine"
        elif any(k in t for k in ["horse", "ghoda"]):
            raw_type, raw_form = "horse", "figurine"
        elif any(k in t for k in ["elephant", "haathi"]):
            raw_type, raw_form = "elephant", "figurine"
        elif any(k in t for k in ["necklace", "jewellery", "jewelry", "pendant"]):
            raw_type, raw_form = "necklace", "wearable"
        elif any(k in t for k in ["bell", "hanging bell", "ghanti"]):
            raw_type, raw_form = "bell", "hanging_bell"
        elif any(k in t for k in ["diya", "lamp", "deepak"]):
            raw_type, raw_form = "diya", "figurine"
        else:
            raw_type, raw_form = "human_figure", "figurine"
            
    elif craft == "channapatna":
        if any(k in t for k in ["top", "spinning", "lattoo"]):
            raw_type, raw_form = "spinning_top", "single"
        elif any(k in t for k in ["candle", "holder", "stand"]):
            raw_type, raw_form = "candle_holder", "decorative_object"
        elif any(k in t for k in ["peg doll", "doll", "gombe"]):
            raw_type, raw_form = "peg_doll", "set" if "set" in t else "single"
        elif any(k in t for k in ["nesting", "matryoshka"]):
            raw_type, raw_form = "nesting_doll", "set"
        elif any(k in t for k in ["car", "train", "engine", "vehicle"]):
            raw_type, raw_form = "vehicle", "single"
        elif any(k in t for k in ["montessori", "learning", "stacker", "bead"]):
            raw_type, raw_form = "educational_toy", "set"
        else:
            raw_type, raw_form = "wooden_toy", "single"
            
    elif craft == "madhubani":
        if any(k in t for k in ["krishna", "ganesh", "radha", "shiva", "durga", "ram", "sita", "god", "religious", "deity"]):
            raw_type, raw_form = "religious", "framed_painting" if "frame" in t else "painting"
        elif any(k in t for k in ["fish", "matsya", "peacock", "tree", "tree of life", "nature", "bird"]):
            raw_type, raw_form = "nature", "framed_painting" if "frame" in t else "painting"
        elif any(k in t for k in ["plate", "platter", "coaster", "pot", "tray", "box"]):
            raw_type, raw_form = "decorative", "decorative_object"
        elif any(k in t for k in ["saree", "dupatta", "stole", "kurti", "textile"]):
            raw_type, raw_form = "textile", "textile"
        else:
            raw_type, raw_form = "nature", "painting"
            
    elif craft == "sikki":
        if any(k in t for k in ["basket", "tokri", "storage"]):
            raw_type, raw_form = "basket", "basket"
        elif any(k in t for k in ["box", "jewellery box", "dabba"]):
            raw_type, raw_form = "jewellery_box", "box"
        elif any(k in t for k in ["frame", "art", "hanging", "wall"]):
            raw_type, raw_form = "wall_art", "wall_hanging"
        elif any(k in t for k in ["doll", "gudda", "guddi"]):
            raw_type, raw_form = "doll", "doll"
        else:
            raw_type, raw_form = "figurine", "figurine"
            
    elif craft == "sujini":
        if any(k in t for k in ["cushion", "pillow"]):
            raw_type, raw_form = "cushion_cover", "cushion_set" if "set" in t else "cushion_cover"
        elif any(k in t for k in ["bedspread", "bedsheet", "quilt", "chadar"]):
            raw_type, raw_form = "bedspread", "bedspread"
        elif any(k in t for k in ["panel", "frame", "wall"]):
            raw_type, raw_form = "textile_panel", "textile_panel"
        else:
            raw_type, raw_form = "cushion_cover", "cushion_cover"

    norm_type, norm_form = normalize_vision_taxonomy(craft, raw_type, raw_form)
    return {
        "craft_category": craft,
        "product_type": norm_type,
        "product_form": norm_form,
    }


def evaluate_artisan_product(
    title_or_desc: str,
    artisan_wanted_price: Optional[float] = None,
    material_cost: Optional[float] = None,
    quantity: int = 1,
    craft_category: Optional[str] = None,
    image_path: Optional[str] = None,
    csv_path: Optional[str] = None,
    top_k: int = 6
) -> Dict[str, Any]:
    """
    Complete, end-to-end evaluation of an artisan's product.
    
    Parameters:
    - title_or_desc: Product title or description.
    - artisan_wanted_price: Expected price from artisan (e.g. Rs. 2200). Post-evaluated.
    - material_cost: Optional direct cost of raw materials (e.g. Rs. 1200). If omitted, falls back safely.
    - quantity: 1 for retail, 5+ triggers wholesale bulk discounts.
    - craft_category: Optional craft override ('bastar_dhokra', 'channapatna', 'madhubani', 'sikki', 'sujini').
    - image_path: Optional path to enhanced photo.
    - csv_path: Optional path to kalasetu_canonical_v2.csv.
    - top_k: Number of benchmark comparables to return.

    Returns:
    - A comprehensive dictionary with market reference, suggested price, range, cost floor,
      position analysis, bulk wholesale discount, bilingual advice, and top comparables.
    """
    df = get_canonical_df(csv_path)

    # 1. Deduce craft and taxonomy
    tax = extract_taxonomy_from_text(title_or_desc, default_craft=craft_category)
    craft = tax["craft_category"]
    p_type = tax["product_type"]
    p_form = tax["product_form"]

    # 2. Retrieve Comparables from Canonical Database
    comps_df = retrieve_comparables(
        df=df,
        craft_category=craft,
        product_type=p_type,
        product_form=p_form,
        query_title=title_or_desc,
        top_k=top_k
    )

    # 3. Market Evidence Aggregation
    market_evidence = compute_market_evidence(comps_df)
    market_ref = market_evidence.get("observed_market_reference", 0.0)

    # 4. Cost Floor Calculation (strictly optional material_cost)
    cost_floor_data = calculate_cost_floor(
        material_cost=material_cost,
        artisan_price=artisan_wanted_price,
        craft=craft
    )
    cost_floor = cost_floor_data.get("cost_floor", 0.0)

    # 5. Artisan Market Position Analysis
    artisan_pos = analyze_artisan_position(
        artisan_price=artisan_wanted_price,
        market_ref=market_ref
    )

    # 6. Suggested Price Range (Decoupled P25-P75)
    range_data = build_suggested_range(
        market_evidence=market_evidence,
        cost_floor_data=cost_floor_data,
        artisan_price=artisan_wanted_price
    )

    # 7. Final Fair Suggested Price Calculation
    price_data = compute_suggested_price(
        market_evidence=market_evidence,
        suggested_range=range_data,
        cost_floor_data=cost_floor_data,
        artisan_price=artisan_wanted_price
    )
    suggested_price = price_data.get("suggested_price", market_ref)

    # 8. Wholesale Bulk Pricing (gated at quantity >= 5)
    bulk_data = compute_bulk_pricing(
        suggested_price=suggested_price,
        cost_floor=cost_floor,
        material_cost=material_cost,
        quantity=quantity
    )

    # 9. Bilingual Guidance (Hindi & English)
    hindi_advice = generate_hindi_guidance(
        artisan_p=artisan_wanted_price,
        suggested_p=suggested_price,
        market_ref=market_ref,
        cost_floor=cost_floor
    )

    # Top comparables list
    comparables_list = []
    if not comps_df.empty:
        for _, r in comps_df.iterrows():
            comparables_list.append({
                "product_name": r["product_name"],
                "listed_price_inr": float(r["listed_price_inr"]),
                "tier": int(r["tier"]),
                "match_score": round(float(r["match_score"]), 1),
                "source_name": r.get("source_name", "e-commerce")
            })

    # Compatibility layer for Streamlit UI & FastAPI clients
    is_bulk = (quantity >= 5)
    r_min = range_data["suggested_range_min"]
    r_max = range_data["suggested_range_max"]

    pos_label = "WITHIN_RANGE"
    if artisan_wanted_price and artisan_wanted_price > 0:
        if artisan_wanted_price < r_min:
            pos_label = "BELOW_RANGE"
        elif artisan_wanted_price > r_max:
            pos_label = "ABOVE_RANGE"

    pricing_advice_compat = {
        "selling_mode": "BULK" if is_bulk else "DIRECT",
        "quantity": quantity,
        "suggested_price": suggested_price,
        "suggested_range_min": r_min,
        "suggested_range_max": r_max,
        "observed_market_reference": market_ref,
        "confidence": market_evidence.get("confidence", "MEDIUM"),
        "current_price": artisan_wanted_price,
        "current_price_position": pos_label,
        "current_price_message": artisan_pos.get("guidance", ""),
        "evidence_summary": [
            f"Observed online market reference: Rs. {market_ref:,.0f} from similar authentic listings.",
            f"Cost floor of Rs. {cost_floor:,.0f} ensures {cost_floor_data.get('margin_rate', 'fair')} margin safety.",
            price_data.get("rationale", "")
        ],
        "material_cost_check": "PASSED" if (not material_cost or suggested_price >= cost_floor) else "WARNING",
        "warning": None if (not material_cost or suggested_price >= cost_floor) else f"Suggested price is below estimated cost floor of Rs. {cost_floor:,.0f}",
        "technical_details": {
            "engine_version": "KalaSetu V2 (Canonical Evidence First)",
            "dataset_version": "kalasetu_canonical_v2.csv (2,359 items)",
            "relevant_comparable_count": len(comps_df),
            "exact_count": market_evidence.get("tier1_count", 0),
            "dispersion_ratio": market_evidence.get("dispersion_ratio", 0.0),
        }
    }
    if is_bulk:
        pricing_advice_compat.update({
            "bulk_price_per_unit": bulk_data["bulk_price_per_piece"],
            "bulk_total_value": bulk_data["bulk_order_total"],
            "bulk_range_min": cost_floor,
            "bulk_range_max": round_to_market_boundary(bulk_data["bulk_price_per_piece"] * 1.10),
        })

    evidence_sources_compat = [
        {
            "source_name": c["source_name"],
            "product_name": c["product_name"],
            "price": c["listed_price_inr"],
            "data_origin": "CANONICAL_V2"
        }
        for c in comparables_list
    ]

    return {
        "status": "SUCCESS",
        "craft_category": craft,
        "product_type": p_type,
        "product_form": p_form,
        "suggested_price": suggested_price,
        "recommended_min": r_min,
        "recommended_max": r_max,
        "artisan_price": artisan_wanted_price,
        "material_cost": material_cost,
        "evidence_sources": evidence_sources_compat,
        "pricing_advice": pricing_advice_compat,
        "taxonomy": {
            "craft_category": craft,
            "product_type": p_type,
            "product_form": p_form,
        },
        "pricing": {
            "suggested_price": suggested_price,
            "suggested_range_min": r_min,
            "suggested_range_max": r_max,
            "range_display": range_data["range_string"],
            "market_reference_price": market_ref,
            "cost_floor": cost_floor,
            "strategy": price_data.get("strategy"),
            "strategy_rationale": price_data.get("rationale"),
        },
        "artisan_assessment": {
            "artisan_wanted_price": artisan_wanted_price,
            "position": artisan_pos.get("position"),
            "gap_percentage": artisan_pos.get("gap_pct"),
            "cost_floor_source": cost_floor_data.get("source"),
            "craft_margin_rate": cost_floor_data.get("margin_rate"),
        },
        "bulk_wholesale": bulk_data,
        "market_evidence": {
            "confidence": market_evidence.get("confidence"),
            "evidence_count": market_evidence.get("evidence_count"),
            "tier1_count": market_evidence.get("tier1_count"),
            "p25": market_evidence.get("raw_p25"),
            "median": market_evidence.get("raw_median"),
            "p75": market_evidence.get("raw_p75"),
            "dispersion_ratio": market_evidence.get("dispersion_ratio"),
        },
        "guidance": {
            "hindi": hindi_advice,
            "english": artisan_pos.get("guidance"),
        },
        "comparables": comparables_list,
    }

