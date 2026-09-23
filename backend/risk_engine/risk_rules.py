"""Deterministic Insurance Risk Rules Engine.

Implements transparent, explainable rule sets for:
1. Health Insurance
2. Automobile Insurance
3. Life Insurance

All calculations are strictly deterministic and mathematical.
LLMs do NOT calculate numerical risk scores.
"""

from typing import List, Tuple, Dict, Any
from backend.schemas.risk import RiskAnalysisRequest, RiskLevel


def get_risk_level(score: int) -> RiskLevel:
    """Categorize numerical risk score (0-100) into LOW, MEDIUM, or HIGH."""
    if score < 40:
        return RiskLevel.LOW
    elif score < 70:
        return RiskLevel.MEDIUM
    else:
        return RiskLevel.HIGH


def evaluate_health_risk(request: RiskAnalysisRequest) -> Tuple[int, RiskLevel, List[str], Dict[str, Any]]:
    """Evaluate Health Insurance Risk using deterministic rules."""
    score = 20  # Baseline health risk
    factors: List[str] = []
    breakdown: Dict[str, Any] = {"base_score": score}

    # 1. Age factor evaluation
    age = request.age if request.age is not None else 35
    if age < 30:
        age_score = 5
    elif age <= 45:
        age_score = 15
    elif age <= 60:
        age_score = 25
        factors.append("Age between 46-60 increases health vulnerability")
    else:
        age_score = 35
        factors.append("Senior age bracket (>60) significantly increases health risks")
    score += age_score
    breakdown["age_score"] = age_score

    # 2. Claim Frequency evaluation
    claims = request.claims_count or 0
    if claims == 0:
        claims_score = -5
    elif claims == 1:
        claims_score = 5
    elif claims == 2:
        claims_score = 15
        factors.append("Moderate claim frequency (2 claims recorded)")
    else:
        claims_score = 25
        factors.append("High claim frequency")
    score += claims_score
    breakdown["claims_frequency_score"] = claims_score

    # 3. Claim Amount vs Coverage Ratio
    total_claim = float(request.total_claim_amount or 0.0)
    coverage = float(request.coverage_amount or 0.0)
    
    ratio = (total_claim / coverage) if coverage > 0 else 0.0
    breakdown["claim_to_coverage_ratio"] = round(ratio, 4)

    claim_amount_score = 0
    if ratio >= 0.7:
        claim_amount_score = 22
        factors.append("High claim amount")
    elif ratio >= 0.4:
        claim_amount_score = 12
        factors.append("High claim amount")
    elif ratio >= 0.2:
        claim_amount_score = 8
        factors.append("Moderate claim amount relative to coverage")
    elif total_claim > 0:
        claim_amount_score = 4
    score += claim_amount_score
    breakdown["claim_amount_score"] = claim_amount_score

    # 4. Pre-existing Conditions / Medical History
    medical_score = 0
    conditions = request.pre_existing_conditions or []
    if conditions:
        medical_score += min(len(conditions) * 10, 20)
        factors.append(f"Pre-existing medical conditions: {', '.join(conditions)}")

    prev_history = str(request.previous_claim_history or "").strip().lower()
    if prev_history in ["yes", "true", "chronic", "frequent hospitalization", "high"]:
        medical_score += 10
        if "High claim frequency" not in factors:
            factors.append("History of recurring medical claims")

    # 5. Smoking Status
    smoking = str(request.smoking_status or "").strip().lower()
    if smoking in ["true", "yes", "smoker", "1"]:
        medical_score += 15
        factors.append("Active tobacco/smoking risk factor")

    # 6. BMI classification
    if request.bmi is not None:
        if request.bmi >= 30.0:
            medical_score += 10
            factors.append("Elevated BMI indicates obesity risk")
        elif request.bmi < 18.5:
            medical_score += 5
            factors.append("Underweight BMI classification")

    score += medical_score
    breakdown["medical_history_score"] = medical_score

    # Normalize to 0 - 100
    final_score = max(0, min(100, int(round(score))))
    level = get_risk_level(final_score)
    return final_score, level, factors, breakdown


def evaluate_automobile_risk(request: RiskAnalysisRequest) -> Tuple[int, RiskLevel, List[str], Dict[str, Any]]:
    """Evaluate Automobile Insurance Risk using deterministic rules."""
    score = 20  # Baseline auto risk
    factors: List[str] = []
    breakdown: Dict[str, Any] = {"base_score": score}

    # 1. Driving Record & Accidents
    accidents = request.accident_count or 0
    if accidents == 0:
        accident_score = -5
    elif accidents == 1:
        accident_score = 15
        factors.append("One recorded traffic accident on record")
    else:
        accident_score = 30
        factors.append(f"Multiple recorded accidents ({accidents} accidents)")
    score += accident_score
    breakdown["accident_score"] = accident_score

    # 2. Vehicle Age
    veh_age = request.vehicle_age
    veh_age_score = 0
    if veh_age is not None:
        if veh_age > 10:
            veh_age_score = 20
            factors.append("Vehicle age exceeds 10 years (high mechanical risk)")
        elif veh_age >= 6:
            veh_age_score = 10
            factors.append("Vehicle age between 6-10 years")
        else:
            veh_age_score = 0
    score += veh_age_score
    breakdown["vehicle_age_score"] = veh_age_score

    # 3. Location Risk
    loc = str(request.location_risk or "MEDIUM").strip().upper()
    loc_score = 0
    if loc == "HIGH":
        loc_score = 20
        factors.append("High-risk location (elevated theft and collision density)")
    elif loc == "MEDIUM":
        loc_score = 10
    else:
        loc_score = 0
    score += loc_score
    breakdown["location_score"] = loc_score

    # 4. Claims Frequency & Loss Ratio
    claims = request.claims_count or 0
    claims_score = 0
    if claims >= 3:
        claims_score += 20
        factors.append("High auto claim frequency")
    elif claims >= 1:
        claims_score += 10
        factors.append("Prior auto claims recorded")

    total_claim = float(request.total_claim_amount or 0.0)
    veh_val = float(request.vehicle_value or request.coverage_amount or 0.0)
    if veh_val > 0:
        ratio = total_claim / veh_val
        breakdown["claim_to_vehicle_value_ratio"] = round(ratio, 4)
        if ratio >= 0.5:
            claims_score += 20
            factors.append("Cumulative claims exceed 50% of vehicle value")
        elif ratio >= 0.25:
            claims_score += 10
            factors.append("Substantial prior vehicle repair claims")
    elif total_claim > 100000:
        claims_score += 15
        factors.append("High cumulative claim amount")

    score += claims_score
    breakdown["claims_score"] = claims_score

    # Normalize to 0 - 100
    final_score = max(0, min(100, int(round(score))))
    level = get_risk_level(final_score)
    return final_score, level, factors, breakdown


def evaluate_life_risk(request: RiskAnalysisRequest) -> Tuple[int, RiskLevel, List[str], Dict[str, Any]]:
    """Evaluate Life Insurance Risk using deterministic rules."""
    score = 15  # Baseline life risk
    factors: List[str] = []
    breakdown: Dict[str, Any] = {"base_score": score}

    # 1. Age Factor (Mortality curve)
    age = request.age if request.age is not None else 35
    if age < 30:
        age_score = 5
    elif age <= 45:
        age_score = 15
    elif age <= 55:
        age_score = 25
        factors.append("Middle-age bracket with increasing health risk")
    else:
        age_score = 40
        factors.append("Senior age bracket (>55) carries elevated mortality risk")
    score += age_score
    breakdown["age_score"] = age_score

    # 2. Occupation Hazard
    occ = str(request.occupation_risk or "LOW").strip().upper()
    occ_score = 0
    if occ == "HIGH":
        occ_score = 25
        factors.append("Hazardous occupation category")
    elif occ == "MEDIUM":
        occ_score = 12
        factors.append("Moderate occupational hazard")
    else:
        occ_score = 0
    score += occ_score
    breakdown["occupation_score"] = occ_score

    # 3. Financial Underwriting: Coverage to Income Ratio
    income = float(request.income or 0.0)
    coverage = float(request.coverage_amount or 0.0)
    financial_score = 0
    if income > 0:
        ratio = coverage / income
        breakdown["coverage_to_income_ratio"] = round(ratio, 2)
        if ratio > 20:
            financial_score = 20
            factors.append("Coverage exceeds 20x annual income (over-insurance risk)")
        elif ratio > 12:
            financial_score = 10
            factors.append("Substantial coverage amount (12x-20x annual income)")
    elif coverage > 5000000:
        financial_score = 15
        factors.append("High policy coverage amount without declared income")
    score += financial_score
    breakdown["financial_score"] = financial_score

    # 4. Policy Term and Maturity Horizon
    term = request.policy_term or 15
    term_score = 0
    if (age + term) >= 70:
        term_score = 15
        factors.append(f"Policy maturity at age {age + term} extends past standard retirement")
    elif term >= 30:
        term_score = 8
        factors.append("Long-term coverage horizon (30+ years)")
    score += term_score
    breakdown["policy_term_score"] = term_score

    # 5. Lifestyle / Tobacco usage
    tobacco = request.tobacco_use
    smoking = str(request.smoking_status or "").strip().lower()
    if tobacco is True or smoking in ["true", "yes", "smoker", "1"]:
        score += 25
        factors.append("Active tobacco/nicotine usage significantly elevates mortality risk")
        breakdown["tobacco_score"] = 25

    # 6. Family Medical History
    fam = str(request.family_medical_history or "").strip().lower()
    if fam in ["chronic", "cancer", "cardiac", "heart", "high_risk", "yes"]:
        score += 15
        factors.append("Hereditary critical illness in family medical history")
        breakdown["family_history_score"] = 15

    # Normalize to 0 - 100
    final_score = max(0, min(100, int(round(score))))
    level = get_risk_level(final_score)
    return final_score, level, factors, breakdown
