import { Routes, Route } from 'react-router-dom'
import { HomePage } from './jsx'
import { ChatPage } from './chat'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App