import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, LayoutDashboard, LogOut, Bed, KeyRound, Bell, BarChart3, Settings, Users, Search, DollarSign, Calendar, CheckCircle, XCircle, Clock, AlertCircle, FileText, Filter, Eye, MapPin, Phone, Mail, CreditCard, Hash, Package } from 'lucide-react';
import Header from '../components/branch manager/Header.jsx';
import Sidebar from '../components/branch manager/Sidebar.jsx';
import axios from 'axios';

const HOTEL_ID = 1;
const API = '/api/reservations';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef(null);

  useEffect(() => {
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${API}/hotel`, {
        params: { hotel_id: HOTEL_ID }
        });
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    finally {
        setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status) => {
    const styles = {
      Booked: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Checked-in': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Checked-out': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return styles[status] || styles.Booked;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Booked':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'Checked-in':
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.guest.firstName} ${booking.guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.room_number.includes(searchTerm);

    const matchesStatus = filterStatus === 'All' || booking.booking_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    booked: bookings.filter(b => b.booking_status === 'Booked').length,
    cancelled: bookings.filter(b => b.booking_status === 'Cancelled').length,
    totalRevenue: bookings
      .filter(b => b.booking_status !== 'Cancelled')
      .reduce((sum, b) => sum + parseFloat(b.room_rate_at_booking), 0)
  };

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }} className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');
        
        .font-display {
          font-family: 'Playfair Display', serif;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Header
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Loading bookings...</p>
        </div>
      </div>):(

        <div className="max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Bookings Management
                </h1>
                <p className="text text-gray-500 dark:text-gray-400">View and manage all hotel reservations</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active Bookings</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{stats.booked}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">{stats.cancelled}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">
                        LKR {stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by guest, reservation ID, room..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="All">All Status</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Checked-in">Checked-in</option>
                    <option value="Checked-out">Checked-out</option>
                  </select>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.reservation_id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                                {booking.guest.firstName} {booking.guest.lastName}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(booking.booking_status)}`}>
                                {getStatusIcon(booking.booking_status)}
                                {booking.booking_status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{booking.reservation_number}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{booking.guest.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Bed className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Room</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                {booking.room.room_number} (Floor {booking.room.floor})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Check-in</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(booking.check_in_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Check-out</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(booking.check_out_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Amount</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                LKR {parseFloat(booking.room_rate_at_booking).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{booking.number_of_guests} Guest(s)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{calculateNights(booking.check_in_date, booking.check_out_date)} Night(s)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Booked on {formatDate(booking.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No bookings found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
            </div>
            )}
          </main>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#0d93f2]" />
                <div>
                  <h2 className="text-sm font-bold text-[#003366] dark:text-white">Booking Details</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedBooking.reservation_number}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusBadge(selectedBooking.booking_status)}`}>
                  {getStatusIcon(selectedBooking.booking_status)}
                  {selectedBooking.booking_status}
                </span>
              </div>

              {/* Guest Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0d93f2]" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {selectedBooking.guest.firstName} {selectedBooking.guest.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.guest.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.guest.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Guest ID</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">#{selectedBooking.guest.guestId}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0d93f2]" />
                  Booking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reservation Number</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.reservation_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Number of Guests</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.number_of_guests}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-in Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(selectedBooking.check_in_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-out Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(selectedBooking.check_out_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Nights</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date)} Night(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Booking Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(selectedBooking.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#0d93f2]" />
                  Room Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room Number</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.room.room_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room Type ID</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Type #{selectedBooking.room.room_type_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Floor</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Floor {selectedBooking.room.floor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room Status</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedBooking.room.status}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#0d93f2]" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room Rate</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      LKR {parseFloat(selectedBooking.room_rate_at_booking).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold text-[#0d93f2]">
                      LKR {(parseFloat(selectedBooking.room_rate_at_booking) * calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#0d93f2]" />
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hotel ID</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">#{selectedBooking.hotel_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(selectedBooking.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;