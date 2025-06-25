// API Types
export interface Interview {
  id: number
  job_title: string
  job_description: string
  company?: string
  status: string
  created_at: string
  completed_at?: string
}

export interface InterviewCreate {
  job_title: string
  job_description: string
  company?: string
}

export interface InterviewResponse {
  response_text: string
  question_id: number
}

export interface InterviewFeedback {
  interview_id: number
  overall_score: number
  feedback_summary: string
  detailed_feedback: Array<{
    question: string
    response: string
    score: number
    feedback: string
  }>
}

// Component Types
export interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  feedback?: string
  score?: number
}

export interface JobDescriptionForm {
  job_title: string
  company: string
  job_description: string
} 