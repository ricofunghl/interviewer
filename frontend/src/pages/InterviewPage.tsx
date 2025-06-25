import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, MessageSquare, User, Bot } from 'lucide-react'
import { startInterview, submitResponse } from '../services/api'

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  feedback?: string
  score?: number
}

interface InterviewPageProps {
  setCurrentInterview: (id: number) => void
}

const InterviewPage = ({ setCurrentInterview }: InterviewPageProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [error, setError] = useState('')

  const interviewId = parseInt(id || '0')

  useEffect(() => {
    if (interviewId) {
      setCurrentInterview(interviewId)
      initializeInterview()
    }
  }, [interviewId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeInterview = async () => {
    try {
      setIsLoading(true)
      const result = await startInterview(interviewId)
      
      if (result.current_question) {
        setCurrentQuestionId(result.question_id)
        setMessages([
          {
            id: '1',
            type: 'ai',
            content: `Welcome to your interview! Let's start with the first question:\n\n${result.current_question}`,
            timestamp: new Date()
          }
        ])
      }
    } catch (err) {
      setError('Failed to start interview. Please try again.')
      console.error('Error starting interview:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || !currentQuestionId || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    setCurrentInput('')
    setIsLoading(true)

    try {
      const result = await submitResponse(interviewId, {
        response_text: currentInput,
        question_id: currentQuestionId
      })

      // Add AI feedback message
      const feedbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `**Feedback:** ${result.feedback}\n\n**Score:** ${result.score}/10\n\n**Suggestions:**\n${result.suggestions.map((s: string) => `• ${s}`).join('\n')}`,
        timestamp: new Date(),
        feedback: result.feedback,
        score: result.score
      }

      setMessages((prev: Message[]) => [...prev, feedbackMessage])

      if (result.interview_complete) {
        setInterviewComplete(true)
        setMessages((prev: Message[]) => [...prev, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: '🎉 **Interview Complete!**\n\nGreat job! You\'ve completed all the questions. Click the button below to view your detailed feedback and performance analysis.',
          timestamp: new Date()
        }])
      } else if (result.next_question) {
        setCurrentQuestionId(result.next_question_id)
        setMessages((prev: Message[]) => [...prev, {
          id: (Date.now() + 3).toString(),
          type: 'ai',
          content: `**Next Question:**\n\n${result.next_question}`,
          timestamp: new Date()
        }])
      }
    } catch (err) {
      setError('Failed to submit response. Please try again.')
      console.error('Error submitting response:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewFeedback = () => {
    navigate(`/feedback/${interviewId}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Mock Interview</h1>
          {interviewComplete && (
            <button
              onClick={handleViewFeedback}
              className="btn-primary flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Feedback
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.type}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'ai' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="h-4 w-4 text-primary-600" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">
                    {message.type === 'ai' ? 'AI Interviewer' : 'You'}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong>{line.slice(2, -2)}</strong>
                        ) : line.startsWith('• ') ? (
                          <span className="block ml-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                  {message.score && (
                    <div className="mt-2 text-sm text-gray-600">
                      Score: <span className="font-semibold">{message.score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message ai">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">AI Interviewer</div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-gray-600">Processing your response...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!interviewComplete && (
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response..."
              className="input-field flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default InterviewPage 