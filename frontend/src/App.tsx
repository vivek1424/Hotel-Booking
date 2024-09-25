
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Layout from './layouts/Layout'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import AddHotel from './pages/AddHotel'
import { useAppContext } from './contexts/AppContext'
import MyHotels from './pages/MyHotels'
import EditHotel from './pages/EditHotel'
import SearchBar from './components/SearchBar'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'



const App = () => {
  const {isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout>
          <p>This is the home page</p>
        </Layout>}></Route>
        <Route 
        path="/search" 
        element={
        <Layout>
          <Search/>
        </Layout>}>
        </Route>
        <Route 
        path="/detail/:hotelId" 
        element={
        <Layout>
          <Detail/>
        </Layout>}>
        </Route>
        <Route path='/register' element={
          <Layout> <Register /></Layout>
        }></Route>
        <Route path='/sign-in' element={<Layout> <SignIn/></Layout>} />

        {
           isLoggedIn && <>
           <Route path="/add-hotel" element={
            <Layout><AddHotel/> </Layout>
           } />
            <Route path="/edit-hotel/:hotelId" element={
            <Layout><EditHotel/> </Layout>
           } />
           <Route path="/my-hotels" element={
            <Layout><MyHotels/> </Layout>
           } />
            <Route path="/hotel/:hotelId/booking" element={
            <Layout> <Booking/> </Layout>
           } />
           <Route path="/my-bookings" element={
            <Layout><MyBookings/> </Layout>
           } />
           </>
        }

      </Routes>
    </Router>
  )
}

export default App


//this is for the core structure and layout of the application, routes, navigation etc 