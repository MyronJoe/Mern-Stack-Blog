import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Signin from './pages/Signin'
import About from './pages/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './components/dashboard/CreatePost'
import UpdatePost from './components/dashboard/UpdatePost'
import PostPage from './pages/PostPage'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPage/>} />


        <Route element={<PrivateRoute />}>

          <Route path='/dashboard' element={<Dashboard />} />

        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>

          <Route path='/create-post' element={<CreatePost />} />

          <Route path='/update-post/:postId' element={<UpdatePost />} />

        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
