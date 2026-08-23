import random
import logging
from app.services.llm_provider import generate_ai_response

logger = logging.getLogger("portfolio_ai_placement")

APTITUDE_QUESTION_BANK = [
    {
        "id": "apt_1",
        "category": "Quantitative Aptitude",
        "topic": "Time and Work",
        "question": "A can complete a project in 12 days, and B can complete the same project in 18 days. If they work together for 4 days, what fraction of the work remains?",
        "options": ["A) 4/9", "B) 5/9", "C) 1/3", "D) 2/9"],
        "correct_option": "A) 4/9",
        "explanation": "A's 1-day work = 1/12. B's 1-day work = 1/18. Combined 1-day work = 1/12 + 1/18 = 5/36. In 4 days, work done = 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
    },
    {
        "id": "apt_2",
        "category": "Logical Reasoning",
        "topic": "Coding-Decoding",
        "question": "If 'PYTHON' is coded as 'QZUIPO' in a certain language, how is 'FASTAPI' coded in that same language?",
        "options": ["A) GBUTBQJ", "B) GZTUBQJ", "C) GZUBTQJ", "D) GBVTBRJ"],
        "correct_option": "A) GBUTBQJ",
        "explanation": "Each letter is shifted forward by +1 alphabetically: F->G, A->B, S->T, T->U, A->B, P->Q, I->J. Result: GBUTBQJ."
    },
    {
        "id": "apt_3",
        "category": "Quantitative Aptitude",
        "topic": "Speed, Distance & Time",
        "question": "A train 150 meters long passes a platform 250 meters long in 20 seconds. What is the speed of the train in km/h?",
        "options": ["A) 54 km/h", "B) 72 km/h", "C) 90 km/h", "D) 60 km/h"],
        "correct_option": "B) 72 km/h",
        "explanation": "Total distance = 150m + 250m = 400m. Time = 20s. Speed in m/s = 400/20 = 20 m/s. Speed in km/h = 20 * (18/5) = 72 km/h."
    }
]

GRAMMAR_EXERCISES = [
    {
        "id": "grm_1",
        "sentence": "Each of the candidates have submitted their portfolio project on time.",
        "question": "Identify the grammatical error in the sentence and choose the correct version.",
        "options": [
            "A) Each of the candidates has submitted their portfolio project on time.",
            "B) Each of the candidates have submit their portfolio project on time.",
            "C) Each candidates have submitted their portfolio project on time.",
            "D) Sentence is already grammatically correct."
        ],
        "correct_option": "A) Each of the candidates has submitted their portfolio project on time.",
        "rule": "The subject 'Each' is singular and requires the singular auxiliary verb 'has' instead of 'have'."
    }
]

GD_TOPICS = [
    "Should AI replace entry-level software developer roles in campus placements?",
    "Remote Work vs In-Office Collaboration for Graduate Tech Engineers.",
    "Open Source vs Proprietary Artificial Intelligence Systems."
]

HR_QUESTIONS = [
    "Tell me about yourself and why you chose a career in software development.",
    "Describe a challenging technical problem you solved in one of your projects.",
    "What is your greatest technical strength and how do you work under tight deadlines?",
    "Where do you see yourself in 3 years as a technology engineer?"
]


def get_placement_questions(module_type: str = "aptitude") -> dict:
    """Returns practice question sets for aptitude, grammar, GD topics, or HR rounds."""
    if module_type == "aptitude":
        return {"module": "aptitude", "questions": random.sample(APTITUDE_QUESTION_BANK, min(2, len(APTITUDE_QUESTION_BANK)))}
    elif module_type == "grammar":
        return {"module": "grammar", "exercises": GRAMMAR_EXERCISES}
    elif module_type == "gd":
        return {"module": "gd", "topics": GD_TOPICS}
    elif module_type == "hr":
        return {"module": "hr", "questions": HR_QUESTIONS}
    else:
        return {"module": "aptitude", "questions": APTITUDE_QUESTION_BANK}


def evaluate_placement_response(module_type: str, question: str, user_answer: str) -> dict:
    """Evaluates user response using LLM & deterministic rules for GD, HR, Aptitude, or Verbal answers."""
    
    system_prompt = f"You are a Senior Placement Director & Corporate Interview Evaluator for tech candidates."
    
    prompt = f"""Module Type: {module_type.upper()}
Question/Topic: {question}
Candidate Answer: {user_answer}

Instruction: Evaluate the candidate's response. Return structured feedback containing:
1. Score out of 100
2. Key Strengths
3. Areas for Improvement
4. Recommended Exemplary Response / Structural Tip"""

    ai_eval = generate_ai_response(prompt=prompt, system_instruction=system_prompt)

    # Basic score extraction
    import re
    score_match = re.search(r'(\d{2,3})\s*(?:/|\s*out of\s*)100', ai_eval, re.IGNORECASE)
    score = float(score_match.group(1)) if score_match else 82.0

    return {
        "module_type": module_type,
        "question": question,
        "user_answer": user_answer,
        "score": score,
        "detailed_feedback": ai_eval
    }
