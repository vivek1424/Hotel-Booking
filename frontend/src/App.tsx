
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Layout from './layouts/Layout'
import Register from './pages/Register'
import SignIn from './pages/SignIn'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>
          <p>This is the home page</p>
        </Layout>}></Route>
        <Route path="/search" element={<Layout>
          <p>This is the search page</p>
        </Layout>}></Route>
        <Route path='/register' element={
          <Layout> <Register /></Layout>
        }></Route>
        <Route path='/sign-in' element={<Layout> <SignIn/></Layout>} />
      </Routes>
    </Router>
  )
}

export default App


//this is for the core structure and layout of the application, routes, navigation etc 