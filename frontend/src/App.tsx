import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import InterviewPage from './pages/InterviewPage'
import HistoryPage from './pages/HistoryPage'
import FeedbackPage from './pages/FeedbackPage'
import ConversationPage from './pages/conversationPage'

function App() {
  const [currentInterview, setCurrentInterview] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Placeholder: Show current interview ID if set */}
      {currentInterview !== null && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 text-sm text-center">
          Current Interview ID: {currentInterview}
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage setCurrentInterview={setCurrentInterview} />} />
          <Route 
            path="/interview/:id" 
            element={<InterviewPage setCurrentInterview={setCurrentInterview} />} 
          />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/feedback/:id" element={<FeedbackPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 