import React, { useState } from 'react';
import axios from 'axios';
import { 
  Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Bell,
  Bed, DollarSign, Edit2, Save, Plus, Trash2, Search, Filter,
  Calendar, Users, TrendingUp, Eye, Settings, Package, Image as ImageIcon
} from 'lucide-react';
import Header from '../components/branch manager/Header.jsx';
import Sidebar from '../components/branch manager/Sidebar.jsx';
import { useEffect } from 'react';

const RoomInventory = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
};
  const [activeTab, setActiveTab] = useState('inventory');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState(['Standard Room', 'Deluxe Ocean View Suite', 'Family Suite', 'Honeymoon Suite']);
  const [roomStatuses, setRoomStatuses] = useState(['Available', 'Occupied', 'Maintenance', 'Reserved']);
  const [availableFeatures, setAvailableFeatures] = useState(['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Butler', 'Balcony', 'Sea View']);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // setRoomTypes(['Standard', 'Deluxe', 'Suite', 'Executive']);
    // setRoomStatuses(['Available', 'Occupied', 'Maintenance', 'Reserved']);
    // setAvailableFeatures(['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Butler', 'Balcony', 'Sea View']);


  useEffect(() => {
    const getRoomInventory = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get('/api/rooms/getAllRooms');

     if (res.success) {
      const inventory = res.data.map(room => ({
        id: room.room_id,                     // ← room_id, not id
        number: room.room_number,
        status: room.status,
        floor: room.floor,
        capacity: room.RoomType.max_capacity,
        type: room.RoomType.type_name,
        basePrice: Number(room.RoomType.base_rate),
        weekendPrice: Number(room.RoomType.weekend_rate || room.RoomType.base_rate),
        features: room.RoomType.amenities,    // ← amenities, not features
        image: room.RoomType.image_url        // ← image_url, not image
      }));
      setRooms(inventory);
      setLoading(false);
    }
   } catch (err) {
    console.error('Error fetching room inventory:', err);
    setRooms([
    { id: 1, number: '101', type: 'Standard', floor: 1, capacity: 2, status: 'Available', basePrice: 15000, weekendPrice: 18000, features: ['WiFi', 'TV', 'AC'], image: '🛏️' },
    { id: 2, number: '102', type: 'Standard', floor: 1, capacity: 2, status: 'Occupied', basePrice: 15000, weekendPrice: 18000, features: ['WiFi', 'TV', 'AC'], image: '🛏️' },
    { id: 3, number: '201', type: 'Deluxe', floor: 2, capacity: 3, status: 'Available', basePrice: 25000, weekendPrice: 30000, features: ['WiFi', 'TV', 'AC', 'Mini Bar'], image: '🏨' },
    { id: 4, number: '202', type: 'Deluxe', floor: 2, capacity: 3, status: 'Maintenance', basePrice: 25000, weekendPrice: 30000, features: ['WiFi', 'TV', 'AC', 'Mini Bar'], image: '🏨' },
    { id: 5, number: '301', type: 'Suite', floor: 3, capacity: 4, status: 'Available', basePrice: 45000, weekendPrice: 55000, features: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'], image: '🌟' },
    { id: 6, number: '401', type: 'Executive', floor: 4, capacity: 4, status: 'Available', basePrice: 55000, weekendPrice: 65000, features: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Butler'], image: '👑' },
  ]);
  
    }
  };
  setLoading(false);

  // invoke
  getRoomInventory();

  }, []);
 

  

  const [formData, setFormData] = useState({
    room_id: null,
    number: '',
    type: '',
    floor: 1,
    capacity: 2,
    status: 'Available',
    basePrice: 15000,
    weekendPrice: 18000,
    features: []
  });

  

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Bookings', icon: Calendar, href: '#' },
    { name: 'Staff Management', icon: Users, href: '#' },
    { name: 'Room Inventory', icon: Bed, href: '#', current: true },
    { name: 'Services', icon: Package, href: '#' },
    { name: 'Reports', icon: TrendingUp, href: '#' },
    { name: 'Pricing', icon: DollarSign, href: '#' },
  ];

  const stats = [
    { label: 'Total Rooms', value: rooms.length, icon: Bed, color: 'blue' },
    { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, icon: Eye, color: 'green' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'Occupied').length, icon: Users, color: 'purple' },
    { label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, icon: Settings, color: 'orange' },
  ];

  const handleOpenModal = (mode, room = null) => {
    setModalMode(mode);
    if (mode === 'edit' && room) {
      setSelectedRoom(room);
      setFormData(room);
    } else {
      setFormData({
        room_id: null,
        number: '',
        type: '',
        floor: 1,
        status: '',
        capacity: 2,
        basePrice: 15000,
        weekendPrice: 18000,
      });
    }
    setShowModal(true);
  };




  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleSubmit = async () => {
    if (!formData.number) {
      alert('Please enter room number');
      return;
    }

    if (modalMode === 'add') {
      setRooms([...rooms, { ...formData, id: rooms.length + 1}]);
      try{
        const res = await axios.post('/api/rooms/addRoom', {
        ...formData,
        hotel_id: 1
        });
      if(res.data.success === true){
        setSubmitMessage({ type: 'success', text: 'Room added successfully' });
        setTimeout(() => {
            handleCloseModal();
            setSubmitMessage({ type: '', text: '' });
      }, 10000);
      }else{
        setSubmitMessage({ type: 'error', text: res.error || 'Operation failed' });

      }

      }catch(err){
        setSubmitMessage({ type: 'error', text: err.message || 'Operation failed' });
      }

    } else {
      setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, ...formData } : r));
      try{
        const res = await axios.put('/api/rooms/updateRoom', {
        ...formData,
        });
      if(res.data.success === true){
        setSubmitMessage({ type: 'success', text: 'Room updated successfully' });
        setTimeout(() => {
           handleCloseModal();
          setSubmitMessage({ type: '', text: '' });
      }, 10000);
      }else{
        setSubmitMessage({ type: 'error', text: res.error || 'Operation failed' });
      }
      }catch(err){
        setSubmitMessage({ type: 'error', text: err.message || 'Operation failed' });

      }
    }
    setTimeout(() => {
            setSubmitMessage({ type: '', text: '' });
      }, 2000);
  
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== id));
        try{
          const res = await axios.delete('/api/rooms/deleteRoom', { data: { room_id: id } });
          if(res.data.success === true){
             window.alert('Room deleted successfully');
          } else {
            window.alert('Failed to delete room');
            console.error(res.data.error || 'Operation failed');
          }
        }catch(err){
          window.alert('Failed to delete room');
          console.error(err.message || 'Operation failed');
        }
    }
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    const matchesType = filterType === 'All' || room.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Occupied': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'Reserved': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div style={{ fontFamily: 'Manrope, sans-serif' }} className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">

       {/*  loading overlay  */}
   {loading && (
     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
       <div className="flex flex-col items-center gap-3">
         <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
         </svg>
           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading rooms…</span>
       </div>
     </div>
   )}

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
        
       {/* Page Content */}
         <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Room Inventory & Pricing
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your hotel rooms, availability, and pricing strategies
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-3 font-medium text-sm transition-all ${
                  activeTab === 'inventory'
                    ? 'border-b-2 border-[#003366] text-[#003366] dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Room Inventory
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-6 py-3 font-medium text-sm transition-all ${
                  activeTab === 'pricing'
                    ? 'border-b-2 border-[#003366] text-[#003366] dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Pricing Management
              </button>
            </div>
          </div>

         

          {/* Controls Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by room number or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option>All Status</option>
                  {roomStatuses.map(status => <option key={status}>{status}</option>)}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="All Types">All Types</option> {/* ✅ has explicit value */}
                  <option>All Types</option>
                  {roomTypes.map(type => <option key={type}>{type}</option>)}
                </select>

                <button
                  onClick={() => handleOpenModal('add')}
                  className="flex items-center gap-2 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Room</span>
                </button>
              </div>
            </div>
          </div>

          {/* Room Grid/Table */}
          {activeTab === 'inventory' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <img src={room.image} alt={`Room ${room.number}`} className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700" />
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Room {room.number}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{room.type}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Floor:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{room.floor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                        <span className="font-semibold text-[#003366] dark:text-blue-400">LKR {room.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Weekend Price:</span>
                        <span className="font-semibold text-[#003366] dark:text-blue-400">LKR {room.weekendPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.features?.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal('edit', room)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Pricing Strategy
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Room Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Base Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Weekend Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypes.map((type, idx) => {
                      const typeRooms = rooms.filter(r => r.type === type);
                      const avgBase = typeRooms.reduce((sum, r) => sum + r.basePrice, 0) / typeRooms.length || 0;
                      const avgWeekend = typeRooms.reduce((sum, r) => sum + r.weekendPrice, 0) / typeRooms.length || 0;
                      

                      return (
                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">{type}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({typeRooms.length} rooms)</span>
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                            LKR {avgBase.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                            LKR {avgWeekend.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-[#003366] dark:text-blue-400 hover:underline text-sm font-medium">
                              Adjust Pricing
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-grey-200 bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#003366] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {modalMode === 'add' ? 'Add New Room' : 'Edit Room'}

                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Room Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="">Not selected</option> {/*  */}
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Floor *
                  </label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="10"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    max="8"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="">Not selected</option> {/*  */}
                    {roomStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Base Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    step="1000"
                  />
                </div> */}

                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Weekend Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    step="1000"
                  />
                </div> */}
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Room Features
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.features.includes(feature)
                          ? 'border-[#003366] bg-[#003366] text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#003366]'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div> */}

              {submitMessage.text && (
                   <div className={`w-full text-sm font-medium p-3 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                           {submitMessage.text}
                  </div>
              )}



              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {modalMode === 'add' ? 'Add Room' : 'Update Room'}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomInventory;