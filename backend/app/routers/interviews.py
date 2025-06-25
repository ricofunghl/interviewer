from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Interview, Question, Response, User
from ..schemas import InterviewCreate, Interview as InterviewSchema, InterviewStart, InterviewResponse, InterviewFeedback
from ..ai_service import AIService

router = APIRouter(prefix="/api/interviews", tags=["interviews"])
ai_service = AIService()


@router.post("/create", response_model=InterviewSchema)
def create_interview(interview_data: InterviewCreate, db: Session = Depends(get_db)):
    """Create a new interview from job description"""
    try:
        # For now, create a mock user (in production, you'd get this from auth)
        user = db.query(User).first()
        if not user:
            user = User(email="test@example.com", name="Test User")
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create interview
        interview = Interview(
            user_id=user.id,
            job_title=interview_data.job_title,
            job_description=interview_data.job_description,
            company=interview_data.company
        )
        db.add(interview)
        db.commit()
        db.refresh(interview)
        
        # Generate questions using AI
        questions_data = ai_service.generate_interview_questions(
            interview_data.job_description,
            interview_data.job_title
        )
        
        # Save questions to database
        for q_data in questions_data:
            question = Question(
                interview_id=interview.id,
                question_text=q_data["question_text"],
                question_type=q_data["question_type"],
                order_index=q_data["order_index"]
            )
            db.add(question)
        
        db.commit()
        
        return interview
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating interview: {str(e)}"
        )


@router.post("/{interview_id}/start")
def start_interview(interview_id: int, db: Session = Depends(get_db)):
    """Start an interview session"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    interview.status = "in_progress"
    db.commit()
    
    # Get first question
    first_question = db.query(Question).filter(
        Question.interview_id == interview_id
    ).order_by(Question.order_index).first()
    
    return {
        "interview_id": interview_id,
        "status": "started",
        "current_question": first_question.question_text if first_question else None,
        "question_id": first_question.id if first_question else None
    }


@router.post("/{interview_id}/respond")
def submit_response(
    interview_id: int,
    response_data: InterviewResponse,
    db: Session = Depends(get_db)
):
    """Submit a response to a question"""
    # Verify interview exists and is in progress
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    if interview.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview is not in progress"
        )
    
    # Get the question
    question = db.query(Question).filter(
        Question.id == response_data.question_id,
        Question.interview_id == interview_id
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Evaluate response using AI
    evaluation = ai_service.evaluate_response(
        question.question_text,
        response_data.response_text,
        question.question_type
    )
    
    # Save response
    response = Response(
        interview_id=interview_id,
        question_id=response_data.question_id,
        response_text=response_data.response_text,
        ai_feedback=evaluation["feedback"],
        score=evaluation["score"]
    )
    db.add(response)
    db.commit()
    
    # Get next question
    next_question = db.query(Question).filter(
        Question.interview_id == interview_id,
        Question.order_index > question.order_index
    ).order_by(Question.order_index).first()
    
    # Check if interview is complete
    if not next_question:
        interview.status = "completed"
        db.commit()
    
    return {
        "response_id": response.id,
        "feedback": evaluation["feedback"],
        "score": evaluation["score"],
        "suggestions": evaluation["suggestions"],
        "next_question": next_question.question_text if next_question else None,
        "next_question_id": next_question.id if next_question else None,
        "interview_complete": not next_question
    }


@router.get("/{interview_id}/feedback", response_model=InterviewFeedback)
def get_interview_feedback(interview_id: int, db: Session = Depends(get_db)):
    """Get comprehensive feedback for completed interview"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    if interview.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview is not completed"
        )
    
    # Get all responses with questions
    responses = db.query(Response).filter(Response.interview_id == interview_id).all()
    questions = db.query(Question).filter(Question.interview_id == interview_id).all()
    
    # Prepare data for AI feedback
    interview_data = {
        "job_title": interview.job_title,
        "responses": []
    }
    
    for response in responses:
        question = next((q for q in questions if q.id == response.question_id), None)
        if question:
            interview_data["responses"].append({
                "question": question.question_text,
                "response": response.response_text,
                "score": response.score,
                "feedback": response.ai_feedback
            })
    
    # Generate overall feedback
    overall_feedback = ai_service.generate_interview_feedback(interview_data)
    
    return InterviewFeedback(
        interview_id=interview_id,
        overall_score=overall_feedback["overall_score"],
        feedback_summary=overall_feedback["summary"],
        detailed_feedback=interview_data["responses"]
    )


@router.get("/history")
def get_interview_history(db: Session = Depends(get_db)):
    """Get user's interview history"""
    # For now, get all interviews (in production, filter by user)
    interviews = db.query(Interview).order_by(Interview.created_at.desc()).all()
    
    return [
        {
            "id": interview.id,
            "job_title": interview.job_title,
            "company": interview.company,
            "status": interview.status,
            "created_at": interview.created_at,
            "completed_at": interview.completed_at
        }
        for interview in interviews
    ] 