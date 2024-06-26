import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <App />
    
  </React.StrictMode>,
)
