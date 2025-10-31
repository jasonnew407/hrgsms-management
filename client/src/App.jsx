import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import HomePage from './web/HomePage.jsx'
import FAQPage from './web/FAQPage'
import ServicesPage from './web/ServicePage.jsx'
import ContactPage from './web/Contact.jsx'
import ManagementPortalLogin from './web/ManagementPortalLogin.jsx'
import GuestLoginPage from './web/GuestLoginPage.jsx'
import GuestSignupPage from './web/GuestSignupPage.jsx'
import ManagementPortal from './web/ManagementPortal.jsx'
import BranchesPage from './web/BranchesPage.jsx'
import BookingPage from './web/BookingSearchPage.jsx'
//admin imports
import BranchManagerDashboard from './admin/BranchManagerDashboard.jsx'
import RoomInventory from './admin/RoomInventory.jsx'
import StaffManagement from './admin/StaffUserManegement.jsx';
import ServiceManagement from './admin/ServiceManagement.jsx';
import RefundManagement from './admin/RefundManagement.jsx';
import BookingManagement from './admin/BookingDetails.jsx'

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path ="/" element={<HomePage />} />
      <Route path ="/faq-page" element={<FAQPage/>} />
      <Route path ="/service-page" element={<ServicesPage/>} />
      <Route path ="/contact-page" element={<ContactPage/>} />
      <Route path ="/branches" element={<BranchesPage/>} />
      <Route path ="/management-portal-login" element={<ManagementPortalLogin/>} />
      <Route path ="/guest-login" element={<GuestLoginPage/>} />
      <Route path ="/guest-signup" element={<GuestSignupPage/>} />
      <Route path ="/management" element={<ManagementPortal />} />
      <Route path ="/booking-search" element={<BookingPage />} />
      
      //admin Routes
      <Route path ="/admin/branch-manager-dashboard" element={<BranchManagerDashboard />} />
      <Route path = "/admin/room-inventory" element={<RoomInventory />} />
      <Route path= '/admin/staff-management' element={<StaffManagement />} />
      <Route path = "/admin/service-management" element= {<ServiceManagement />} />
      <Route path = "/admin/refund-management" element= {<RefundManagement />} />
      <Route path = "/admin/booking-management" element= {<BookingManagement />} />
    </Routes>
  </BrowserRouter>
}
