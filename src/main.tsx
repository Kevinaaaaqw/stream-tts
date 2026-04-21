import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './reset.css'
import App from './App.tsx'
import { OverlayPage } from './pages/OverlayPage.tsx'
import { GuidePage } from './pages/GuidePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/overlay" element={<OverlayPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
