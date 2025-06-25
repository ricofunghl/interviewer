import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { getInterviewFeedback, InterviewFeedback } from '../services/api'

const FeedbackPage = () => {
  const { id } = useParams<{ id: string }>()
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const interviewId = parseInt(id || '0')

  useEffect(() => {
    if (interviewId) {
      loadFeedback()
    }
  }, [interviewId])

  const loadFeedback = async () => {
    try {
      setIsLoading(true)
      const data = await getInterviewFeedback(interviewId)
      setFeedback(data)
    } catch (err) {
      setError('Failed to load feedback.')
      console.error('Error loading feedback:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 6) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  if (error || !feedback) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Feedback</h3>
          <p className="text-gray-600 mb-6">{error || 'Feedback not found'}</p>
          <Link to="/history" className="btn-primary">
            Back to History
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/history" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h1>
        <p className="text-gray-600">Detailed analysis of your interview performance</p>
      </div>

      {/* Overall Score */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Overall Performance</h2>
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className={`text-3xl font-bold ${getScoreColor(feedback.overall_score)}`}>
              {feedback.overall_score}/10
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700">{feedback.feedback_summary}</p>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Question-by-Question Analysis</h2>
        
        <div className="space-y-6">
          {feedback.detailed_feedback.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h3>
                <div className="flex items-center space-x-2">
                  {getScoreIcon(item.score)}
                  <span className={`font-semibold ${getScoreColor(item.score)}`}>
                    {item.score}/10
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{item.question}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Your Response:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded">{item.response}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                  <p className="text-gray-700 bg-green-50 p-3 rounded">{item.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mt-8">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">Recommendations for Improvement</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Clear communication skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Good behavioral examples</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Professional demeanor</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Provide more specific examples</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Use STAR method for behavioral questions</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Include quantifiable results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link to="/" className="btn-primary">
          Start New Interview
        </Link>
        <Link to="/history" className="btn-secondary">
          View All Interviews
        </Link>
      </div>
    </div>
  )
}

export default FeedbackPage 