from datetime import datetime, timedelta


# ==========================================
# AUTOMATIC CATEGORY DETECTION
# ==========================================

def detect_category(text: str):

    text = text.lower()

    categories = {

        "Electrical": [
            "fan",
            "light",
            "electricity",
            "power",
            "switch",
            "bulb"
        ],

        "Plumbing": [
            "water",
            "pipe",
            "leak",
            "tap",
            "washroom",
            "toilet"
        ],

        "IT": [
            "wifi",
            "internet",
            "network",
            "computer",
            "printer"
        ],

        "Cleaning": [
            "dirty",
            "dust",
            "garbage",
            "clean"
        ]
    }

    for category, keywords in categories.items():

        for word in keywords:

            if word in text:
                return category

    return "General"


# ==========================================
# AUTOMATIC PRIORITY DETECTION
# ==========================================

def detect_priority(text: str):

    text = text.lower()

    if any(word in text for word in [
        "fire",
        "shock",
        "sparking",
        "danger"
    ]):
        return "Critical"

    elif any(word in text for word in [
        "water leak",
        "broken",
        "not working"
    ]):
        return "High"

    elif any(word in text for word in [
        "slow",
        "noise",
        "issue"
    ]):
        return "Medium"

    return "Low"


# ==========================================
# SLA DEADLINE
# ==========================================

def calculate_sla(priority: str):

    if priority == "Critical":
        return datetime.utcnow() + timedelta(hours=4)

    elif priority == "High":
        return datetime.utcnow() + timedelta(hours=24)

    elif priority == "Medium":
        return datetime.utcnow() + timedelta(days=2)

    return datetime.utcnow() + timedelta(days=3)


# ==========================================
# ESCALATION CHECK
# ==========================================

def should_escalate(sla_deadline):

    return datetime.utcnow() > sla_deadline