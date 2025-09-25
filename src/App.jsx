import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomePage from './HomePage'
import ChatPage from './chat'
import DataVisualization from './DataVisualization'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/visualization" element={<DataVisualization />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App