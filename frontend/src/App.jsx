import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import UpdateProfile from './pages/UpdateProfile'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import "./App.css"
import UsersList from './pages/UsersList'
import UserProfile from './pages/UserProfile'

function App() {


  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-profile" element={<MyProfile/>} />
        <Route path="/all-users" element={<UsersList/>} />
        <Route path="/user/:id" element={<UserProfile/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
