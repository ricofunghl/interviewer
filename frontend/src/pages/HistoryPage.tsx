import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Building, Clock, Eye, Play } from 'lucide-react'
import { getInterviewHistory, Interview } from '../services/api'

const HistoryPage = () => {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInterviewHistory()
  }, [])

  const loadInterviewHistory = async () => {
    try {
      setIsLoading(true)
      const data = await getInterviewHistory()
      setInterviews(data)
    } catch (err) {
      setError('Failed to load interview history.')
      console.error('Error loading history:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { label: 'Created', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.created
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview History</h1>
        <p className="text-gray-600">Review your past interviews and performance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews yet</h3>
          <p className="text-gray-600 mb-6">
            Start your first mock interview to see your history here.
          </p>
          <Link to="/" className="btn-primary">
            Create Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.job_title}
                    </h3>
                    {getStatusBadge(interview.status)}
                  </div>
                  
                  {interview.company && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      {interview.company}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    Created: {formatDate(interview.created_at)}
                    {interview.completed_at && (
                      <>
                        <span className="mx-2">•</span>
                        Completed: {formatDate(interview.completed_at)}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {interview.status === 'completed' ? (
                    <Link
                      to={`/feedback/${interview.id}`}
                      className="btn-primary flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Feedback
                    </Link>
                  ) : interview.status === 'created' ? (
                    <Link
                      to={`/interview/${interview.id}`}
                      className="btn-primary flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Interview
                    </Link>
                  ) : (
                    <Link
                      to={`/interview/${interview.id}`}
                      className="btn-secondary flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage 