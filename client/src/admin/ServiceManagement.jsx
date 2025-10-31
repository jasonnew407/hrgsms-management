import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Menu, ChevronDown, User, LayoutDashboard, LogOut, Bed, KeyRound, Bell, BarChart3, Settings, Users, Plus, Search, Edit2, Trash2, X, Save, UserPlus, UserMinus, Clock, DollarSign, Wrench } from 'lucide-react';
import Sidebar from '../components/branch manager/Sidebar.jsx';
import Header from '../components/branch manager/Header.jsx';



const HOTEL_ID = 1;   
const API        = 'https://backendproject-hndhecg3c5g3avf8.southindia-01.azurewebsites.net/api/services';   



const ServiceCatalogManagement = () => {
  const [data,setData]=useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [services,setServices] = useState([]);

  
    


   const [availableStaff, setAvailableStaff] = useState([
    { id: 2, name: 'Sarah Johnson', role: 'Server', available: true },
   ]);

    useEffect(() => {
  console.log("Available Staff State Changed:", availableStaff);
}, [availableStaff]);

  useEffect(() => {
  const fetchServices = async () => {
    setData(false);
    try {
      const res = await axios.get(`${API}/getAllServices`);
      if(res.data.success === true) {
      setServices([]);
      const mappedServices = res.data.data.map(service => ({
          id: service.service_id,
          name: service.service_name,
          description: service.description,
          category: service.service_type,
          price: parseFloat(service.price),
          duration: service.unit,
          active: service.is_available,
          assignedStaff: service.userServices.map(userService => ({
                 id: userService.user.id,
                 name: `${userService.user.firstname} ${userService.user.lastname}`,
                 role: userService.user.role.role_name
           }))
       }));
       setServices(mappedServices);
       console.log(mappedServices);
       setData(true);
     }
     else{
        console.error("Failed to fetch services" + res.data.error);
     }
    } catch (error) {
      console.log(error);
    }finally {
      setData(true);
      
    }
  }

const fetchServiceStaff = async () => {
  try{
    const res = await axios.get(`${API}/getAllServiceStaff`);
    if(res.data.success === true) {
      setAvailableStaff([]);
      const temp_staff = res.data.data.map(user => ({
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        role: user.role.role_name,
        available: true
      }));

      setAvailableStaff(temp_staff);
      console.log("Available Staff:", availableStaff);
      setTimeout(() => {
        console.log("State after update:", availableStaff);
      }, 100);
    }else{
      console.error("Failed to fetch service staff" + res.data.error);
    }
  }
  catch(error){
    console.error("Error fetching service staff:", error);
  }
  };
  fetchServices();
  fetchServiceStaff();
}
, []);



 

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState('add');
  const [selectedService, setSelectedService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [serviceMessage, setServiceMessage] = useState('');        // <-- NEW
  const [serviceMessageType, setServiceMessageType] = useState('');

  const flashMessage = (msg, type = 'success') => {
    setServiceMessage(msg);
    setServiceMessageType(type);
    setTimeout(() => setServiceMessage(''), 4000); // auto-hide
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
    };
  
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    active: true
  });

  const categories = ['Dining', 'Housekeeping', 'Transportation', 'Wellness', 'Business', 'Entertainment'];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Bed, label: 'Room Availability', active: false },
    { icon: KeyRound, label: 'Check-in / Check-out', active: false },
    { icon: Bell, label: 'Guest Services & Billing', active: false },
    { icon: BarChart3, label: 'Reporting', active: false },
    { icon: Settings, label: 'System Settings', active: false },
    { icon: Users, label: 'User Management', active: false },
    { icon: Wrench, label: 'Service Catalog', active: true },
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

  const handleAddService = async () => {
    setServiceModalMode('add');
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      active: true
    });
    setShowServiceModal(true);
    setServiceMessage('');           // reset banner
    setServiceMessageType('');

  };

  const handleEditService = async (service) => {
    setServiceModalMode('edit');
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      active: service.active
    });
    setShowServiceModal(true);
   setServiceMessage('');
   setServiceMessageType('');
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };
``
  const confirmDelete = async() => {
    setServices(services.filter(s => s.id !== serviceToDelete.id));
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
    const res = await axios.delete(`${API}/deleteService`, {
      params: { service_id: serviceToDelete.id }
    });
    if(res.data.success === true) {
      console.log("Service deleted successfully");
    }
    else{
      console.error("Failed to delete service" + res.data.error);
    }
  };

  const handleSubmitService = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.duration) {
      flashMessage('Please fill in all required fields', 'error');
      return;
    }

    if (serviceModalMode === 'add') {
      const newService = {
        id: Math.max(...services.map(s => s.id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        assignedStaff: []
      };
      setServices([...services, newService]);
      const res = await axios.post(`${API}/addService`, {
          hotel_id: HOTEL_ID,
          service_name: formData.name,
          service_type: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          unit: formData.duration,
          is_available: formData.active
        });
        if (res.data.success) flashMessage('Service added successfully');
        else throw new Error(res.data.error || 'Add failed');
    } else {
      setServices(services.map(s =>
        s.id === selectedService.id
          ? { ...s, ...formData, price: parseFloat(formData.price) }
          : s
      ));
      const res = await axios.put(`${API}/updateService`, {
          service_id: selectedService.id,
          hotel_id: HOTEL_ID,
          service_name: formData.name,
          service_type: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          unit: formData.duration,
          is_available: formData.active
        });
        if (res.data.success) flashMessage('Service updated successfully');
        else throw new Error(res.data.error || 'Update failed');

  }
  };

  const handleManageStaff = (service) => {
    setSelectedService(service);
    setShowStaffModal(true);
  };

  const handleAssignStaff = (staffMember) => {
    setServices(services.map(s => {
      if (s.id === selectedService.id) {
        const isAlreadyAssigned = s.assignedStaff.some(staff => staff.id === staffMember.id);
        if (!isAlreadyAssigned) {
          return {
            ...s,
            assignedStaff: [...s.assignedStaff, staffMember]
          };
        }
      }
      return s;
    }));
    setSelectedService({
      ...selectedService,
      assignedStaff: [...selectedService.assignedStaff, staffMember]
    });
    try{
      const res = axios.post(`${API}/assignServiceToUser`, {
        user_id: staffMember.id,
        service_id: selectedService.id
      });
      if(res.data.success === true) {
        console.log("Staff assigned successfully");
        alert("Staff assigned successfully");
      }
      else{
        console.error("Failed to assign staff" + res.data.error);
      }
    }catch(error){
      console.error("Error assigning staff to service:", error);
    }
  };


  const handleRemoveStaff = (staffId) => {
    setServices(services.map(s => {
      if (s.id === selectedService.id) {
        return {
          ...s,
          assignedStaff: s.assignedStaff.filter(staff => staff.id !== staffId)
        };
      }
      return s;
    }));
    setSelectedService({
      ...selectedService,
      assignedStaff: selectedService.assignedStaff.filter(staff => staff.id !== staffId)
    });
    try{
      const res = axios.post(`${API}/unAssignServiceFromUser`, {
        user_id: staffId,
        service_id: selectedService.id
      });
      if(res.data.success === true) {
        console.log("Staff unassigned successfully");
      }
      else{
        console.error("Failed to unassign staff" + res.data.error);
      }
    }catch(error){
      console.error("Error unassigning staff from service:", error);
    }

  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getUnassignedStaff = () => {
    if (!selectedService) return availableStaff;
    const assignedIds = selectedService.assignedStaff.map(s => s.id);
    return availableStaff.filter(staff => !assignedIds.includes(staff.id));
  };

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
        )
        
      }

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

        {/* Page Content */}
         <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Service Catalog Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure and manage branch services and staff assignments</p>
            </div>

            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                  <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddService}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Services</p>
                    <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">{services.length}</p>
                  </div>
                  <Wrench className="w-8 h-8 text-[#0d93f2] opacity-20" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active Services</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">
                      {services.filter(s => s.active).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-lg font-bold">✓</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
                    <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">
                      {new Set(services.map(s => s.category)).size}
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-[#0d93f2] opacity-20" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned Staff</p>
                    <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">
                      {services.reduce((acc, s) => acc + s.assignedStaff.length, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-[#0d93f2] opacity-20" />
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">{service.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          service.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{service.description}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex gap-0.5 ml-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <span>${service.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <span>{service.duration}</span>
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Assigned Staff ({service.assignedStaff.length})
                      </span>
                      <button
                        onClick={() => handleManageStaff(service)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <UserPlus className="w-3 h-3" />
                        Manage
                      </button>
                    </div>
                    
                    {service.assignedStaff.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {service.assignedStaff.map((staff) => (
                          <div
                            key={staff.id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-3 h-3" />
                            <span>{staff.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500">{staff.role}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">No staff assigned</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No services found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-[#0d93f2]" />
                <h2 className="text-sm font-bold text-[#003366] dark:text-white">
                  {serviceModalMode === 'add' ? 'Add New Service' : 'Edit Service'}
                </h2>
              </div>

              {/* ====== Feedback banner ====== */}
               {serviceMessage && (
                  <div
                    className={`w-full text-xs px-3 py-2 rounded mb-2 ${
                      serviceMessageType === 'success'
                       ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                       : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {serviceMessage}
                  </div>
                )}




              <button
                onClick={() => setShowServiceModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter service name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter service description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="e.g., per session, 30 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Status *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.active === true}
                        onChange={() => setFormData({ ...formData, active: true })}
                        className="w-4 h-4 text-[#0d93f2] focus:ring-[#0d93f2]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.active === false}
                        onChange={() => setFormData({ ...formData, active: false })}
                        className="w-4 h-4 text-[#0d93f2] focus:ring-[#0d93f2]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitService}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {serviceModalMode === 'add' ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Staff Modal */}
      {showStaffModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#0d93f2]" />
                <div>
                  <h2 className="text-sm font-bold text-[#003366] dark:text-white">
                    Manage Staff for {selectedService.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assign or remove staff members</p>
                </div>
              </div>
              <button
                onClick={() => setShowStaffModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Currently Assigned Staff */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currently Assigned ({selectedService.assignedStaff.length})
                </h3>
                {selectedService.assignedStaff.length > 0 ? (
                  <div className="space-y-2">
                    {selectedService.assignedStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#0d93f2]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{staff.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{staff.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStaff(staff.id)}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <UserMinus className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic py-3">No staff currently assigned</p>
                )}
              </div>

              {/* Available Staff to Assign */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Staff ({getUnassignedStaff().length})
                </h3>
                {getUnassignedStaff().length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getUnassignedStaff().map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{staff.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{staff.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignStaff(staff)}
                          className="flex items-center gap-1.5 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <UserPlus className="w-3 h-3" />
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic py-3">All available staff have been assigned</p>
                )}
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md w-full p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Service</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete <strong>{serviceToDelete.name}</strong>? 
              {serviceToDelete.assignedStaff.length > 0 && (
                <span className="block mt-1 text-xs text-red-600 dark:text-red-400">
                  Warning: This service has {serviceToDelete.assignedStaff.length} staff member(s) assigned.
                </span>
              )}
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogManagement;
