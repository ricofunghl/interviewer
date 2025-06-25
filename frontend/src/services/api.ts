import axios from 'axios'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
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

// API functions
export const createInterview = async (data: InterviewCreate): Promise<Interview> => {
  const response = await api.post('/api/interviews/create', data)
  return response.data
}

export const startInterview = async (interviewId: number) => {
  const response = await api.post(`/api/interviews/${interviewId}/start`)
  return response.data
}

export const submitResponse = async (interviewId: number, data: InterviewResponse) => {
  const response = await api.post(`/api/interviews/${interviewId}/respond`, data)
  return response.data
}

export const getInterviewFeedback = async (interviewId: number): Promise<InterviewFeedback> => {
  const response = await api.get(`/api/interviews/${interviewId}/feedback`)
  return response.data
}

export const getInterviewHistory = async (): Promise<Interview[]> => {
  const response = await api.get('/api/interviews/history')
  return response.data
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
) 