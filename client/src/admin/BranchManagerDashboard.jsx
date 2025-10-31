import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, Bed, DollarSign, TrendingUp, Calendar, 
  Bell, Settings, LogOut, ChevronRight, Activity, Clock, 
  CheckCircle, XCircle, AlertCircle, BarChart3, PieChart,
  ShoppingBag, Star, Award, MessageSquare, Menu, X, Home,
  ChevronDown, User
} from 'lucide-react';
import Header from '../components/branch manager/Header.jsx';
import Sidebar from '../components/branch manager/Sidebar.jsx';
import axios from 'axios';



const hotel_id = 1; // Example hotel/branch ID
const dashboardApiBaseUrl = '/api/dashboard';


const BranchManagerDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [roomCount, setRoomCount] = useState({ total: 0, occupied: 0, available: 0 });
  const [reservationCount, setReservationCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [data, setData] = useState(false); 


  
  const toggleSidebar = () => {
      setIsSidebarExpanded(!isSidebarExpanded);
};
  const [notifications] = useState(3);

  useEffect(() => {
  // Fetch dashboard data here using hotel_id
  const fetchDashboardData = async () => {
    try {
      setData(false);
      const res = await axios.get(`${dashboardApiBaseUrl}/info?hotel_id=${hotel_id}`);
      const roomcount = res.data.data;
      setRoomCount(roomcount);
      const res2 = await axios.get(`${dashboardApiBaseUrl}/totalReservations?hotel_id=${hotel_id}`);
      setReservationCount(res2.data.data.totalReservations);
      const res3 = await axios.get(`${dashboardApiBaseUrl}/totalStaffCount?hotel_id=${hotel_id}`);
      setStaffCount(res3.data.data.totalStaff);
      const res4 = await axios.get(`${dashboardApiBaseUrl}/totalBookingAmount?hotel_id=${hotel_id}`);
      setTotalRevenue(res4.data.data.totalAmount);

      const res5 = await axios.get(`${dashboardApiBaseUrl}/recentReservations?hotel_id=${hotel_id}`);
      const temp = res5.data.data.reservations.map((r => ({
        id: r.reservation_id,
        guest: `${r.guest.firstName} ${r.guest.lastName}`,
        room: r.room.room_number,
        checkIn: r.check_in_date,
        status: r.booking_status,
        amount: `LKR ${r.room_rate_at_booking.toLocaleString()}`
      })));
      setRecentBookings(temp);
      const res6 = await axios.get(`${dashboardApiBaseUrl}/roomAvailabilityStats?hotel_id=${hotel_id}`);
      setRoomAvailability(res6.data.data.roomAvailability);
      setData(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
       const recentBookings = [
               { id: 1, guest: 'John Anderson', room: 'Suite 305', checkIn: '2025-10-20', status: 'Confirmed', amount: 'LKR 45,000' },
               { id: 2, guest: 'Sarah Williams', room: 'Deluxe 201', checkIn: '2025-10-21', status: 'Pending', amount: 'LKR 32,000' },
               { id: 3, guest: 'Michael Brown', room: 'Executive 410', checkIn: '2025-10-22', status: 'Confirmed', amount: 'LKR 55,000' },
               { id: 4, guest: 'Emma Davis', room: 'Standard 105', checkIn: '2025-10-23', status: 'Check-in', amount: 'LKR 25,000' }
  ];
    }
     const roomAvailability = [
         { type: 'Standard', total: 50, occupied: 42, available: 8 },
         { type: 'Deluxe', total: 30, occupied: 28, available: 2 },
         { type: 'Suite', total: 15, occupied: 10, available: 5 },
         { type: 'Executive', total: 10, occupied: 9, available: 1 }
  ];
  };

  fetchDashboardData();
}, [hotel_id]);

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `LKR ${totalRevenue.toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-500'
    },
    { 
      title: 'Occupancy Rate', 
      value: roomCount.occupiedRooms && roomCount.totalRooms ? `${((roomCount.occupiedRooms / roomCount.totalRooms) * 100).toFixed(1)}%` : '0%', 
      change: '+5.2%', 
      trend: 'up',
      icon: Bed,
      color: 'green',
      bgColor: 'bg-green-500'
    },
    { 
      title: 'Active Bookings', 
      value: reservationCount.toString(), 
      change: '+8', 
      trend: 'up',
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-500'
    },
    { 
      title: 'Staff On Duty', 
      value: staffCount.toString(), 
      change: '-2', 
      trend: 'down',
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-500'
    }
  ];

 

  const staffPerformance = [
    { name: 'Sarah Johnson', role: 'Front Desk', rating: 4.8, tasks: 45, avatar: 'SJ' },
    { name: 'Michael Chen', role: 'Service Staff', rating: 4.9, tasks: 52, avatar: 'MC' },
    { name: 'Priya Perera', role: 'Front Desk', rating: 4.7, tasks: 38, avatar: 'PP' },
    { name: 'David Silva', role: 'Service Staff', rating: 4.6, tasks: 41, avatar: 'DS' }
  ];

 

  const quickActions = [
    { title: 'New Booking', icon: Calendar, color: 'blue' },
    { title: 'Manage Staff', icon: Users, color: 'purple' },
    { title: 'Room Inventory', icon: Bed, color: 'green' },
    { title: 'Reports', icon: BarChart3, color: 'orange' },
    { title: 'Services', icon: ShoppingBag, color: 'pink' },
    { title: 'Settings', icon: Settings, color: 'slate' }
  ];

  const recentActivities = [
    { action: 'New booking received', time: '5 min ago', type: 'booking' },
    { action: 'Staff member added', time: '20 min ago', type: 'staff' },
    { action: 'Room 305 checked out', time: '1 hour ago', type: 'checkout' },
    { action: 'Service request completed', time: '2 hours ago', type: 'service' }
  ];

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#', current: true },
    { name: 'Bookings', icon: Calendar, href: '#', current: false },
    { name: 'Staff Management', icon: Users, href: '#', current: false },
    { name: 'Room Inventory', icon: Bed, href: '#', current: false },
    { name: 'Services', icon: ShoppingBag, href: '#', current: false },
    { name: 'Reports', icon: BarChart3, href: '#', current: false },
    { name: 'Pricing', icon: DollarSign, href: '#', current: false },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'Confirmed': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Check-in': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }} className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <style>{`
        
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

        {!data && (
          <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading dashboard…</span>
            </div>
          </div>
        )}
         <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Lato, sans-serif' }}>
              Here's what's happening at Colombo Branch today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action, idx) => (
                <button key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all group">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${action.color}-600`} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{action.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Recent Bookings
                </h2>
                <button className="text-[#003366] hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Guest</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Room</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Check-in</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                              {booking.guest.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{booking.guest}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">{booking.room}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-800 dark:text-gray-200 text-sm">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Room Availability */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Room Availability
              </h2>
              <div className="space-y-4">
                {roomAvailability.map((room, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{room.type}</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{room.available}/{room.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          room.available / room.total < 0.2 ? 'bg-red-500' : 
                          room.available / room.total < 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(room.available / room.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{room.occupied} occupied, {room.available} available</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staff Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Top Performing Staff
                </h2>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-4">
                {staffPerformance.map((staff, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {staff.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{staff.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{staff.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{staff.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{staff.tasks} tasks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Recent Activities
                </h2>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'booking' ? 'bg-blue-500' :
                      activity.type === 'staff' ? 'bg-purple-500' :
                      activity.type === 'checkout' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
    </div>
    
  );
};

export default BranchManagerDashboard;