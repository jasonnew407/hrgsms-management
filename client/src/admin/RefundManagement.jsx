import React, { useState, useRef, useEffect, act } from 'react';
import { Menu, ChevronDown, User, LayoutDashboard, LogOut, Bed, KeyRound, Bell, BarChart3, Settings, Users, Search, DollarSign, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, FileText, Calendar, CreditCard, Percent, X } from 'lucide-react';
import Header from '../components/branch manager/Header.jsx';
import Sidebar from '../components/branch manager/Sidebar.jsx'
import axios from 'axios';


const HOTEL_ID = 1;   
const API = 'https://backendproject-hndhecg3c5g3avf8.southindia-01.azurewebsites.net/api/reservations';  

const RefundManagement = () => {
  const [refundRequests, setRefundRequests] = useState([
    {
      id: 1,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      reservationId: 'RES-2024-001',
      roomNumber: '305',
      roomType: 'Deluxe Suite',
      checkInDate: '2024-11-15',
      checkOutDate: '2024-11-20',
      totalAmount: 750.00,
      requestedAmount: 750.00,
      requestDate: '2024-10-20',
      cancellationDate: '2024-10-20',
      reason: 'Emergency family situation',
      status: 'Pending',
      daysBeforeCheckIn: 26,
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      guestName: 'Michael Chen',
      guestEmail: 'michael.c@email.com',
      reservationId: 'RES-2024-002',
      roomNumber: '412',
      roomType: 'Standard Room',
      checkInDate: '2024-11-10',
      checkOutDate: '2024-11-12',
      totalAmount: 320.00,
      requestedAmount: 320.00,
      requestDate: '2024-10-18',
      cancellationDate: '2024-10-18',
      reason: 'Travel restrictions',
      status: 'Pending',
      daysBeforeCheckIn: 23,
      paymentMethod: 'Debit Card'
    },
    {
      id: 3,
      guestName: 'Emily Rodriguez',
      guestEmail: 'emily.r@email.com',
      reservationId: 'RES-2024-003',
      roomNumber: '208',
      roomType: 'Ocean View',
      checkInDate: '2024-11-08',
      checkOutDate: '2024-11-11',
      totalAmount: 540.00,
      requestedAmount: 405.00,
      requestDate: '2024-10-22',
      cancellationDate: '2024-10-22',
      reason: 'Change of plans',
      status: 'Approved',
      daysBeforeCheckIn: 17,
      approvedAmount: 405.00,
      approvedDate: '2024-10-22',
      paymentMethod: 'Credit Card'
    },
    {
      id: 4,
      guestName: 'James Wilson',
      guestEmail: 'james.w@email.com',
      reservationId: 'RES-2024-004',
      roomNumber: '501',
      roomType: 'Presidential Suite',
      checkInDate: '2024-11-05',
      checkOutDate: '2024-11-08',
      totalAmount: 1200.00,
      requestedAmount: 1200.00,
      requestDate: '2024-10-25',
      cancellationDate: '2024-10-25',
      reason: 'Medical emergency',
      status: 'Rejected',
      daysBeforeCheckIn: 11,
      rejectionReason: 'Non-refundable rate booked',
      rejectionDate: '2024-10-25',
      paymentMethod: 'Credit Card'
    }
  ]);

  useEffect(() => {
    // Fetch refund requests from API
    const fetchRefundRequests = async () => {
      try {
        const res = await axios.get(`${API}/cancelled`);
        if (res.data.success) {
          // transform API data into UI model
          const temp_array = res.data.data.map((item) => ({
            id: item.reservation_id,
            guestName: `${item.guest.firstName} ${item.guest.lastName}`,
            guestEmail: item.guest.email,
            reservationId: item.reservation_number,
            roomNumber: item.room.room_number,
            roomType: "" + item.room.room_type_id,
            checkInDate: item.check_in_date,
            checkOutDate: item.check_out_date,
            totalAmount: parseFloat(item.room_rate_at_booking),
            requestedAmount: parseFloat(item.room_rate_at_booking),
            requestDate: new Date(item.created_at).toISOString().split('T')[0],
            cancellationDate: new Date(item.updated_at).toISOString().split('T')[0],
            reason: 'Cancellation',
            status: 'Pending',
            daysBeforeCheckIn: calculateDaysBeforeCheckIn(item.check_in_date, item.created_at),
            paymentMethod: 'Credit Card'
          }));
          setRefundRequests(temp_array);
          console.log('Fetched refund requests:', temp_array);
        } else {
          console.error('Failed to fetch refund requests:', res.data?.error || 'unknown error');
        }
      } catch (error) {
        console.error('Error fetching refund requests:', error);
      }
    };

      // Helper functions
      // Helper function to calculate days before check-in
const calculateDaysBeforeCheckIn = (checkInDate, requestDate) => {
  const checkIn = new Date(checkInDate);
  const request = new Date(requestDate);
  const diffTime = checkIn - request;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};


    fetchRefundRequests();
  }, []);



  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refundDecision, setRefundDecision] = useState({
    action: '',
    approvedAmount: '',
    refundPercentage: 100,
    notes: ''
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  
  const dropdownRef = useRef(null);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Bed, label: 'Room Availability', active: false },
    { icon: KeyRound, label: 'Check-in / Check-out', active: false },
    { icon: Bell, label: 'Guest Services & Billing', active: false },
    { icon: RefreshCw, label: 'Refund Management', active: true },
    { icon: BarChart3, label: 'Reporting', active: false },
    { icon: Settings, label: 'System Settings', active: false },
    { icon: Users, label: 'User Management', active: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleReviewRequest = (request) => {
    setSelectedRequest(request);
    setRefundDecision({
      action: '',
      approvedAmount: request.requestedAmount.toFixed(2),
      refundPercentage: 100,
      notes: ''
    });
    setShowReviewModal(true);
  };

  const calculateRefundAmount = (percentage) => {
    if (!selectedRequest) return 0;
    return (selectedRequest.requestedAmount * (percentage / 100)).toFixed(2);
  };

  const handlePercentageChange = (percentage) => {
    const amount = calculateRefundAmount(percentage);
    setRefundDecision({
      ...refundDecision,
      refundPercentage: percentage,
      approvedAmount: amount
    });
  };

  const handleAmountChange = (amount) => {
    const percentage = ((amount / selectedRequest.requestedAmount) * 100).toFixed(0);
    setRefundDecision({
      ...refundDecision,
      approvedAmount: amount,
      refundPercentage: Math.min(100, Math.max(0, percentage))
    });
  };

  const handleSubmitDecision = async () => {
    if (!refundDecision.action) {
      alert('Please select an action (Approve or Reject)');
      return;
    }

    if (refundDecision.action === 'approve' && !refundDecision.approvedAmount) {
      alert('Please enter the approved refund amount');
      return;
    }

    if (refundDecision.action === 'reject' && !refundDecision.notes) {
      alert('Please provide a reason for rejection');
      return;
    }

    const updatedRequests = refundRequests.map(req => {
      if (req.id === selectedRequest.id) {
        if (refundDecision.action === 'approve') {
          return {
            ...req,
            status: 'Approved',
            approvedAmount: parseFloat(refundDecision.approvedAmount),
            approvedDate: new Date().toISOString().split('T')[0],
            notes: refundDecision.notes
          };
        } else {
          return {
            ...req,
            status: 'Rejected',
            rejectionReason: refundDecision.notes,
            rejectionDate: new Date().toISOString().split('T')[0]
          };
        }
      }
      return req;
    });

    const actionText = refundDecision.action === 'approve' ? 'approved' : 'rejected';
    if(actionText === 'approved') {
      const res = await axios.post(`${API}/approve`, {
        res_id: selectedRequest.id,
        approved_amount: refundDecision.approvedAmount
      });
    } else {
      const res = await axios.post(`${API}/reject`, {
        res_id: selectedRequest.id,
        rejection_reason: refundDecision.notes
      });
      if(res.data.success){
        console.log('Refund request rejected successfully');
      } else {
        console.error('Failed to reject refund request:', res.data?.error || 'unknown error');
      }
    }

    setRefundRequests(updatedRequests);
    setShowReviewModal(false);
    setSelectedRequest(null);
  };

  const filteredRequests = refundRequests.filter(req => {
    const matchesSearch = 
      req.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.roomNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      Approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return styles[status] || styles.Pending;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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

      {/* Header */}
      <Header 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
            isSidebarExpanded={isSidebarExpanded}
            toggleSidebar={toggleSidebar}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Refund Management
                </h1>
                <p className="text text-gray-500 dark:text-gray-400">Review and process guest refund requests</p>
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Requests</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">{refundRequests.length}</p>
                    </div>
                    <RefreshCw className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">
                        {refundRequests.filter(r => r.status === 'Pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">
                        {refundRequests.filter(r => r.status === 'Approved').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">
                        LKR.{refundRequests.reduce((sum, r) => sum + r.requestedAmount, 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
              </div>

              {/* Refund Requests List */}
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Guest Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-white">{request.guestName}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium LKR.{getStatusBadge(request.status)}`}>
                                {getStatusIcon(request.status)}
                                {request.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{request.guestEmail}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Reservation</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{request.reservationId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Bed className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Room</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{request.roomNumber} - {request.roomType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Check-in</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{request.checkInDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Requested</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">LKR.{request.requestedAmount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Cancellation Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Cancellation Reason:</p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{request.reason}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Cancelled {request.daysBeforeCheckIn} days before check-in • Payment via {request.paymentMethod}
                              </p>
                            </div>
                          </div>

                          {/* Approval/Rejection Details */}
                          {request.status === 'Approved' && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-900/30">
                              <p className="text-xs text-green-800 dark:text-green-400">
                                <strong>Approved Amount:</strong> LKR.{request.approvedAmount.toFixed(2)} on {request.approvedDate}
                              </p>
                              {request.notes && (
                                <p className="text-xs text-green-700 dark:text-green-500 mt-1">{request.notes}</p>
                              )}
                            </div>
                          )}

                          {request.status === 'Rejected' && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/30">
                              <p className="text-xs text-red-800 dark:text-red-400">
                                <strong>Rejected on {request.rejectionDate}:</strong> {request.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Action Button */}
                      {request.status === 'Pending' && (
                        <div className="flex items-center ">
                          <button
                            onClick={() => handleReviewRequest(request)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                          >
                            <FileText className="w-4 h-4" />
                            Review Request
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No refund requests found</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-5 h-5 text-[#0d93f2]" />
                <div>
                  <h2 className="text-sm font-bold text-[#003366] dark:text-white">
                    Review Refund Request
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.reservationId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Guest & Reservation Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Reservation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Guest Name</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.roomNumber} - {selectedRequest.roomType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-in Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.checkInDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Check-out Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.checkOutDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">LKR.{selectedRequest.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days Before Check-in</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedRequest.daysBeforeCheckIn} days</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cancellation Reason</p>
                  <p className="text-sm text-gray-800 dark:text-white">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Refund Decision */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Decision *
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRefundDecision({ ...refundDecision, action: 'approve' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all LKR.{
                        refundDecision.action === 'approve'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Refund
                    </button>
                    <button
                      onClick={() => setRefundDecision({ ...refundDecision, action: 'reject' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all LKR.{
                        refundDecision.action === 'reject'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Request
                    </button>
                  </div>
                </div>

                {refundDecision.action === 'approve' && (
                  <>
                    {/* Refund Percentage Slider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Refund Percentage
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={refundDecision.refundPercentage}
                          onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>0%</span>
                          <span className="text-[#0d93f2] font-medium text-sm">{refundDecision.refundPercentage}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Percentage Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 25, 50, 75, 100].map(percent => (
                        <button
                          key={percent}
                          onClick={() => handlePercentageChange(percent)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors LKR.{
                            refundDecision.refundPercentage === percent
                              ? 'bg-[#0d93f2] text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>

                    {/* Approved Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approved Refund Amount *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={selectedRequest.requestedAmount}
                          value={refundDecision.approvedAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Maximum refundable amount: LKR.{selectedRequest.requestedAmount.toFixed(2)}
                      </p>
                    </div>
                  </>
                )}

                {/* Notes/Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {refundDecision.action === 'approve' ? 'Additional Notes (Optional)' : 'Rejection Reason *'}
                  </label>
                  <textarea
                    value={refundDecision.notes}
                    onChange={(e) => setRefundDecision({ ...refundDecision, notes: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder={refundDecision.action === 'approve' ? 'Enter any additional notes...' : 'Please provide a reason for rejection...'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDecision}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors LKR.{
                    refundDecision.action === 'approve'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                      : refundDecision.action === 'reject'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] hover:bg-blue-100 dark:hover:bg-blue-900/40'
                  }`}
                  disabled={!refundDecision.action}
                >
                  {refundDecision.action === 'approve' && <CheckCircle className="w-4 h-4" />}
                  {refundDecision.action === 'reject' && <XCircle className="w-4 h-4" />}
                  {refundDecision.action === 'approve' ? 'Approve Refund' : refundDecision.action === 'reject' ? 'Reject Request' : 'Submit Decision'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;
