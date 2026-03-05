import { useState } from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OnboardingSlides from './pages/OnboardingSlides'
import ProfileSetup from './pages/ProfileSetup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/onboardingslides' element={<OnboardingSlides />} />
          <Route path='/profilesetup' element={<ProfileSetup />} />
      </Routes>
    </BrowserRouter>
  )
}


