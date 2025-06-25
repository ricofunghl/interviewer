from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    email: str
    name: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    question_text: str
    question_type: str
    order_index: int


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: int
    interview_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ResponseBase(BaseModel):
    response_text: str


class ResponseCreate(ResponseBase):
    question_id: int


class Response(ResponseBase):
    id: int
    interview_id: int
    question_id: int
    ai_feedback: Optional[str] = None
    score: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class InterviewBase(BaseModel):
    job_title: str
    job_description: str
    company: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class Interview(InterviewBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[Question] = []
    responses: List[Response] = []
    
    class Config:
        from_attributes = True


class InterviewStart(BaseModel):
    interview_id: int


class InterviewResponse(BaseModel):
    response_text: str
    question_id: int


class InterviewFeedback(BaseModel):
    interview_id: int
    overall_score: float
    feedback_summary: str
    detailed_feedback: List[dict] 