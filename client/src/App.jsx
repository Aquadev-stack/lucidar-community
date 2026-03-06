import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OnboardingSlides from './pages/OnboardingSlides'
import ProfileSetup from './pages/ProfileSetup'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/onboardingslides' element={<OnboardingSlides />} />
        <Route path='/profilesetup' element={<ProfileSetup />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}