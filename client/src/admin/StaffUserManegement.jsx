import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, X, Mail, Phone, MapPin, Briefcase, Save } from 'lucide-react';
import Header from '../components/branch manager/Header.jsx';
import Sidebar from '../components/branch manager/Sidebar.jsx';
import axios from 'axios';

const staffAPI = "https://backendproject-hndhecg3c5g3avf8.southindia-01.azurewebsites.net/api/staff"

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get hotel_id from your auth context or localStorage
  const HOTEL_ID = localStorage.getItem('hotel_id') || 1;

  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    user_role: '',
    password: ''
  });

  const roles = [
    { value: 'Service_Staff', label: 'Service Staff' },
    { value: 'Front_Desk', label: 'Front Desk' }
  ];

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Fetch staff members on component mount
  useEffect(() => {
    fetchStaffMembers();
  }, []);

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

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${staffAPI}/getAll?hotel_id=${HOTEL_ID}`);
      
      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch staff members. Please try again.');
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      fname: '',
      lname: '',
      email: '',
      phone: '',
      user_role: '',
      password: ''
    });
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setModalMode('edit');
    setSelectedStaff(staffMember);
    setFormData({
      fname: staffMember.firstname,
      lname: staffMember.lastname,
      email: staffMember.email,
      phone: staffMember.phone || '',
      user_role: staffMember.role.role_name,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = (staffMember) => {
    setStaffToDelete(staffMember);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${staffAPI}/delete/${staffToDelete.id}`);
      
      if (response.data.success) {
        setStaff(staff.filter(s => s.id !== staffToDelete.id));
        setShowDeleteConfirm(false);
        setStaffToDelete(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete staff member';
      alert(errorMsg);
      console.error('Error deleting staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fname.trim() || !formData.lname.trim() || !formData.email.trim() || !formData.user_role) {
      alert('Please fill in all required fields');
      return;
    }

    if (modalMode === 'add' && !formData.password.trim()) {
      alert('Password is required for new staff members');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      if (modalMode === 'add') {
        const response = await axios.post(`${staffAPI}/add`, {
          hotel_id: HOTEL_ID,
          fname: formData.fname.trim(),
          lname: formData.lname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          password: formData.password,
          user_role: formData.user_role
        });

        if (response.data.success) {
          setStaff([...staff, response.data.data]);
          setShowModal(false);
          resetForm();
        }
      } else {
        const updatePayload = {
          fname: formData.fname.trim(),
          lname: formData.lname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          user_role: formData.user_role
        };

        if (formData.password && formData.password.trim() !== '') {
          updatePayload.password = formData.password;
        }

        const response = await axios.put(`${staffAPI}/update/${selectedStaff.id}`, updatePayload);

        if (response.data.success) {
          setStaff(staff.map(s => 
            s.id === selectedStaff.id ? response.data.data : s
          ));
          setShowModal(false);
          resetForm();
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save staff member';
      alert(errorMsg);
      console.error('Error saving staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fname: '',
      lname: '',
      email: '',
      phone: '',
      user_role: '',
      password: ''
    });
  };

  const filteredStaff = staff.filter(s => {
    const fullName = `${s.firstname} ${s.lastname}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.role.role_name.toLowerCase().includes(searchLower)
    );
  });

  const getBranchAccess = (permissions) => {
    if (!permissions || !permissions.branchAccess) return 'No branches';
    const branchAccess = permissions.branchAccess;
    if (branchAccess.all) return 'All branches';
    
    const branches = Object.entries(branchAccess)
      .filter(([key, value]) => key !== 'all' && value === true)
      .map(([key]) => `Branch ${key}`);
    
    return branches.length > 0 ? branches.join(', ') : 'No branches';
  };

  const formatRoleName = (roleName) => {
    return roleName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
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
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Staff Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your hotel staff members and their roles</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search staff by name, email, role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleAddNew}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Staff Member
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Staff</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">{staff.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email Verified</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">
                        {staff.filter(s => s.is_email_verified).length}
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-gray-600 dark:text-gray-400 mt-0.5">
                        {staff.filter(s => !s.is_email_verified).length}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-lg font-bold">○</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Roles</p>
                      <p className="text-xl font-bold text-[#003366] dark:text-white mt-0.5">
                        {new Set(staff.map(s => s.role.role_name)).size}
                      </p>
                    </div>
                    <Briefcase className="w-8 h-8 text-[#0d93f2] opacity-20" />
                  </div>
                </div>
              </div>

              {loading && staff.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d93f2] mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading staff members...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredStaff.map((staffMember) => (
                      <div
                        key={staffMember.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md dark:hover:border-gray-600 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {staffMember.firstname[0]}{staffMember.lastname[0]}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                                {staffMember.firstname} {staffMember.lastname}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                staffMember.is_email_verified
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}>
                                {staffMember.is_email_verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => handleEdit(staffMember)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Edit"
                              disabled={loading}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(staffMember)}
                              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Briefcase className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span>{formatRoleName(staffMember.role.role_name)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{getBranchAccess(staffMember.role.permissions)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{staffMember.email}</span>
                          </div>
                          {staffMember.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{staffMember.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredStaff.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No staff members found</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Add your first staff member to get started'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={handleAddNew}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Staff Member
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#0d93f2]" />
                <h2 className="text-sm font-bold text-[#003366] dark:text-white">
                  {modalMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter first name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter last name"
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="email@morenahotels.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="+94 77 123 4567"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.user_role}
                    onChange={(e) => setFormData({ ...formData, user_role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    disabled={loading}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                    {modalMode === 'edit' && <span className="text-xs text-gray-500 ml-1">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d93f2] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder={modalMode === 'add' ? 'Enter password' : 'Leave blank to keep current'}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2] rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0d93f2]"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {modalMode === 'add' ? 'Add Staff Member' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && staffToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md w-full p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Staff Member</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete <strong>{staffToDelete.firstname} {staffToDelete.lastname}</strong>? All associated data will be permanently removed.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
