import './i18n.js'; // Import the i18n configuration
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// في ملف index.js أو App.js
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import 'flowbite';


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
