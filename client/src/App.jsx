import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OnboardingSlides from './pages/OnboardingSlides'
import ProfileSetup from './pages/ProfileSetup'
import Home from './pages/Home'
import Profile from './pages/Profile' // Add this
import ProfileEditor from './pages/ProfileEditor' // Add this
import LucidarMarket from './pages/LucidarMarket' // Add this

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
        <Route path='/profile/:username' element={<Profile />} /> {/* Add this */}
        <Route path='/profile' element={<Profile />} /> {/* Own profile */}
        <Route path='/profileeditor' element={<ProfileEditor />} /> {/* Profile editor */}
        <Route path='/lucidar-market' element={<LucidarMarket />} /> {/* Lucidar Market */}
      </Routes>
    </BrowserRouter>
  )
}