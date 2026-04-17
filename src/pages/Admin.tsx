import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { subscribeToServices, subscribeToGallery, addGalleryImage, deleteGalleryImage, saveService, deleteService, subscribeToLeads, markLeadRead, deleteLead, seedDefaults, subscribeToSettings, saveSettings, uploadImageToStorage } from '../lib/cms';
import { Plus, Trash2, LogOut, CheckCircle2, Image as ImageIcon, Settings2, X, AlertTriangle, LayoutDashboard, Loader2, ArrowRight, Inbox, MailOpen, DownloadCloud, FileText, BarChart3, Bell, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ALLOWED_EMAILS = ['mdabdullahislamrafid552@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState<any>({ email: 'admin@system.local', displayName: 'System Admin' });
  const [services, setServices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'services' | 'inbox' | 'pages' | 'settings'>('overview');

  // UI States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  // Page Sub Tab State
  const [pageSubTab, setPageSubTab] = useState<'home' | 'about' | 'contact'>('home');

  // Modular UI Components for Page Editor
  const ControlInput = ({ label, value, onChange, type = "text", placeholder }: any) => (
    <div className="space-y-3">
       <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">{label}</label>
       <input 
         type={type} 
         value={value || ''} 
         onChange={e => onChange(e.target.value)} 
         placeholder={placeholder}
         className="w-full bg-black/40 border border-white/5 rounded-xl text-white px-5 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all font-medium" 
       />
    </div>
  );

  const ControlTextArea = ({ label, value, onChange, placeholder }: any) => (
    <div className="space-y-3">
       <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">{label}</label>
       <textarea 
         value={value || ''} 
         onChange={e => onChange(e.target.value)} 
         placeholder={placeholder}
         className="w-full bg-black/40 border border-white/5 rounded-xl text-white px-5 py-4 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none font-medium leading-relaxed" 
       />
    </div>
  );

  // Settings State
  const [editingSettings, setEditingSettings] = useState<any>({});

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedDefaults();
      showToast('Live site data synchronized!');
    } catch (e) {
      showToast('Failed to sync content', 'error');
    }
    setIsSeeding(false);
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'gallery' | 'service' | 'lead'; id: string } | null>(null);

  // New Image Form
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgCaption, setNewImgCaption] = useState('');
  const [previewError, setPreviewError] = useState(false);

  // New Service Form
  const [editingService, setEditingService] = useState<any>(null);

  // Leads
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const unreadLeadsCount = leads.filter(l => !l.read).length;

  // Optimized components for cleaner code & performance
  const NavButton = ({ active, onClick, icon, label, badge }: any) => (
    <button onClick={onClick} className={`flex justify-between items-center w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold relative group ${active ? 'bg-white text-black shadow-lg shadow-white/5 px-5' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
       <div className="flex items-center gap-3">
          <span className={`transition-transform duration-500 scale-100 ${active ? '' : 'group-hover:scale-110'}`}>{icon}</span>
          {label}
       </div>
       {badge > 0 && (
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${active ? 'bg-black text-white' : 'bg-red-500 text-white animate-pulse'}`}>
             {badge}
          </span>
       )}
       {active && <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-2/3 bg-black rounded-r-full" />}
    </button>
  );

  const MobileNavItem = ({ active, onClick, icon, badge }: any) => (
    <button onClick={onClick} className={`relative p-3 rounded-xl transition-all ${active ? 'bg-white text-black scale-110 shadow-lg' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
       {icon}
       {badge > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-[#171717]"></span>}
    </button>
  );

  const StatCard = ({ title, value, icon, trend, color, highlight, onClick }: any) => {
    const colorClasses: any = {
      blue: 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-400',
      red: 'from-red-500/10 to-transparent border-red-500/20 text-red-400',
      emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
      purple: 'from-purple-500/10 to-transparent border-purple-500/20 text-purple-400'
    };

    return (
      <div 
        onClick={onClick}
        className={`bg-[#171717] border p-6 rounded-[2.5rem] flex flex-col justify-between shadow-xl relative overflow-hidden transition-all hover:scale-[1.02] hover:bg-[#1a1a1a] cursor-pointer group ${colorClasses[color]} ${highlight ? 'ring-1 ring-red-500/30' : ''}`}
      >
        <div className="flex justify-between items-start mb-6">
           <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 transition-transform group-hover:scale-110 ${colorClasses[color].split(' ')[2]}`}>
              {icon}
           </div>
           {trend && <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{trend}</span>}
        </div>
        <div>
           <span className="text-[#a1a1aa] text-[10px] font-black uppercase tracking-widest mb-1 block group-hover:text-white transition-colors">{title}</span>
           <span className="text-4xl font-black text-white tracking-tighter italic">{value}</span>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-[0.03] blur-2xl rounded-full group-hover:opacity-[0.08] transition-opacity"></div>
      </div>
    );
  };

  useEffect(() => {
    const unsubServices = subscribeToServices(setServices);
    const unsubGallery = subscribeToGallery(setGallery);
    const unsubLeads = subscribeToLeads(setLeads);
    const unsubSettings = subscribeToSettings((data) => {
      setSettings(data || {});
      setEditingSettings(data || {});
    });
    
    return () => {
      unsubServices();
      unsubGallery();
      unsubLeads();
      unsubSettings();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl || previewError) return;
    setIsSaving(true);
    await addGalleryImage(newImgUrl, 'Gallery Upload');
    setNewImgUrl('');
    setIsSaving(false);
    showToast('Image published to gallery');
  };

  const [isDragging, setIsDragging] = useState(false);
  
  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');

  const filteredLeads = React.useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        (lead.firstName + ' ' + lead.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.service || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'unread') return matchesSearch && !lead.read;
      if (filterStatus === 'read') return matchesSearch && lead.read;
      return matchesSearch;
    });
  }, [leads, searchTerm, filterStatus]);

  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsSaving(true);
    try {
      const url = await uploadImageToStorage(file);
      await addGalleryImage(url, file.name);
      showToast('Image uploaded & published');
    } catch (error) {
      showToast('Upload failed', 'error');
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsSaving(true);
    try {
      if (deleteConfirm.type === 'gallery') {
        await deleteGalleryImage(deleteConfirm.id);
      } else if (deleteConfirm.type === 'service') {
        await deleteService(deleteConfirm.id);
        setEditingService(null);
      } else if (deleteConfirm.type === 'lead') {
        await deleteLead(deleteConfirm.id);
      }
      showToast(deleteConfirm.type + ' deleted');
    } catch {
      showToast('Failed to delete item', 'error');
    }
    setIsSaving(false);
    setDeleteConfirm(null);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveService(editingService);
      setEditingService(null);
      showToast('Service package updated');
    } catch {
      showToast('Failed to save service', 'error');
    }
    setIsSaving(false);
  };

  const handleCreateNewService = () => {
    setEditingService({ title: '', desc: '', description: '', img: '', features: [''], price: '' });
  };

  const handleEditService = (service: any) => {
      setEditingService({...service, features: service.features || []});
  };

  return (
    <div className="min-h-screen -mt-24 pt-32 pb-24 px-4 md:px-8 w-full bg-[#0a0a0a] text-[#d1d1d1] font-sans">
      <div className="max-w-[1400px] mx-auto relative">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-28 left-1/2 z-50 px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 backdrop-blur-xl border ${
                toast.type === 'success' ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/10 border-red-500/30 text-red-100'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-red-400" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-[#171717] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0"></div>
                <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
                <p className="text-[#a1a1aa] mb-8 text-sm leading-relaxed">Are you sure you want to permanently delete this {deleteConfirm.type}? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end mt-4">
                  <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all" disabled={isSaving}>Cancel</button>
                  <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-500/20 flex items-center gap-2" disabled={isSaving}>
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete 
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          {/* Desktop Sidebar / Mobile Nav Wrapper */}
          <div className="lg:w-72 shrink-0">
             {/* Desktop Sidebar (Hidden on mobile) */}
             <div className="hidden lg:flex lg:flex-col lg:sticky lg:top-32 lg:h-[calc(100vh-160px)] border-r border-white/10 pr-8">
                <div className="mb-10">
                  <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Workspace</h1>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                      <span className="text-white text-xs font-bold text-center">A</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium">Admin</span>
                      <span className="text-[#a1a1aa] text-[10px] truncate max-w-[140px]">{user.email}</span>
                    </div>
                  </div>
                </div>
                
                <nav className="flex flex-col gap-1.5 flex-grow">
                  <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Overview" />
                  <NavButton 
                    active={activeTab === 'inbox'} 
                    onClick={() => setActiveTab('inbox')} 
                    icon={<Inbox size={18} />} 
                    label="Inbox" 
                    badge={unreadLeadsCount > 0 ? unreadLeadsCount : undefined} 
                  />
                  <div className="my-3 mx-2 h-px bg-white/5"></div>
                  <NavButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Settings2 size={18} />} label="Services" />
                  <NavButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon size={18} />} label="Gallery" />
                  <NavButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={<FileText size={18} />} label="Pages" />
                  <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<BarChart3 size={18} />} label="Settings & SEO" />
                </nav>

                <div className="mt-auto pt-8">
                   <button onClick={() => auth.signOut()} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[#a1a1aa] hover:bg-red-500/10 hover:text-red-400 w-full text-sm font-medium border border-transparent hover:border-red-500/20">
                      <LogOut size={18} /> Sign Out
                   </button>
                </div>
             </div>

             {/* Mobile Sticky Top Bar (Only on mobile) */}
             <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-white tracking-tight">Admin Console</h1>
                <div className="flex items-center gap-4">
                   {unreadLeadsCount > 0 && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
                   <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold">A</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Mobile Floating Bottom Nav (Only on mobile) */}
          <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm">
             <div className="bg-[#171717]/90 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
                <MobileNavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} />
                <MobileNavItem active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} icon={<Inbox size={20} />} badge={unreadLeadsCount} />
                <MobileNavItem active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Settings2 size={20} />} />
                <MobileNavItem active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<ImageIcon size={20} />} />
                <MobileNavItem active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} icon={<FileText size={20} />} />
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow lg:pt-0 pb-32">
            {activeTab === 'overview' && (
              <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="mb-10">
                   <h2 className="text-5xl font-black tracking-tighter text-white mb-2 uppercase italic leading-none">Welcome back.</h2>
                   <p className="text-[#a1a1aa] text-sm font-medium tracking-wide">Here is the overview of your detailing business today.</p>
                </div>

                {/* Vertical Visual Guide Line */}
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-red-500/20 via-transparent to-transparent"></div>
                  
                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 pt-8">
                    <StatCard 
                      title="Total Capacity" 
                      value={leads.length} 
                      icon={<Inbox size={20} />} 
                      trend="+12%" 
                      color="blue"
                      onClick={() => { setActiveTab('inbox'); setFilterStatus('all'); window.scrollTo(0,0); }}
                    />
                    <StatCard 
                      title="Pending Needs" 
                      value={unreadLeadsCount} 
                      icon={<MailOpen size={20} />} 
                      trend="Priority" 
                      color="red"
                      highlight={unreadLeadsCount > 0}
                      onClick={() => { setActiveTab('inbox'); setFilterStatus('unread'); window.scrollTo(0,0); }}
                    />
                    <StatCard 
                      title="Active Packages" 
                      value={services.length} 
                      icon={<Settings2 size={20} />} 
                      trend="Stable" 
                      color="emerald"
                      onClick={() => { setActiveTab('services'); window.scrollTo(0,0); }}
                    />
                    <StatCard 
                      title="Portfolio Size" 
                      value={gallery.length} 
                      icon={<ImageIcon size={20} />} 
                      trend="+5" 
                      color="purple"
                      onClick={() => { setActiveTab('gallery'); window.scrollTo(0,0); }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                  {/* Recent Activity Panel */}
                  <div className="lg:col-span-2 bg-[#171717] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <h3 className="text-lg font-black italic uppercase tracking-tight text-white">Recent Leads</h3>
                      <button onClick={() => setActiveTab('inbox')} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-all">
                        View All <ArrowRight size={14}/>
                      </button>
                    </div>
                    <div className="flex-grow">
                      {leads.slice(0,4).map((lead, i) => (
                        <div key={i} className="px-8 py-6 border-b border-white/[0.03] last:border-b-0 flex justify-between items-center hover:bg-white/[0.02] cursor-pointer transition-all group" onClick={() => { setActiveTab('inbox'); window.scrollTo(0,0); }}>
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${!lead.read ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-125' : 'bg-transparent'}`}></div>
                            <div>
                               <p className={`text-sm tracking-tight uppercase font-black transition-colors ${!lead.read ? 'text-white' : 'text-[#71717a] group-hover:text-white'}`}>
                                 {lead.firstName} {lead.lastName}
                               </p>
                               <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mt-0.5">{lead.service || 'General Inquiry'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-medium text-[#71717a]">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {leads.length === 0 && <div className="p-16 text-center text-[#71717a] text-xs font-black uppercase tracking-widest">No recent leads found.</div>}
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-[#171717] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl p-8">
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white mb-8">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                      <button onClick={() => { setActiveTab('services'); window.scrollTo(0,0); }} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all text-left flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#a1a1aa] group-hover:text-white group-hover:scale-110 transition-all">
                          <Plus size={24} />
                        </div>
                        <div>
                          <span className="block text-xs font-black uppercase tracking-widest text-[#a1a1aa] group-hover:text-white">Add Service</span>
                          <span className="text-[10px] text-[#71717a]">Expand catalog</span>
                        </div>
                      </button>
                      
                      <button onClick={() => { setActiveTab('gallery'); window.scrollTo(0,0); }} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all text-left flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#a1a1aa] group-hover:text-white group-hover:scale-110 transition-all">
                          <ImageIcon size={24} />
                        </div>
                        <div>
                          <span className="block text-xs font-black uppercase tracking-widest text-[#a1a1aa] group-hover:text-white">Upload Image</span>
                          <span className="text-[10px] text-[#71717a]">New work</span>
                        </div>
                      </button>

                      <button onClick={() => { setActiveTab('pages'); window.scrollTo(0,0); }} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all text-left flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#a1a1aa] group-hover:text-white group-hover:scale-110 transition-all">
                          <FileText size={24} />
                        </div>
                        <div>
                          <span className="block text-xs font-black uppercase tracking-widest text-[#a1a1aa] group-hover:text-white">Edit Pages</span>
                          <span className="text-[10px] text-[#71717a]">Update copy</span>
                        </div>
                      </button>

                      <button onClick={() => { setActiveTab('settings'); window.scrollTo(0,0); }} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all text-left flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#a1a1aa] group-hover:text-white group-hover:scale-110 transition-all">
                          <BarChart3 size={24} />
                        </div>
                        <div>
                          <span className="block text-xs font-black uppercase tracking-widest text-[#a1a1aa] group-hover:text-white">Update SEO</span>
                          <span className="text-[10px] text-[#71717a]">Rank higher</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {services.length === 0 && gallery.length === 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl mt-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div>
                      <h3 className="text-lg text-emerald-400 mb-1 font-semibold flex items-center gap-2">
                        <CheckCircle2 size={18} /> Initial Setup
                      </h3>
                      <p className="text-[#a1a1aa] text-sm">
                        Load demo services and gallery items to get started instantly.
                      </p>
                    </div>
                    <button 
                      onClick={handleSeedData} 
                      disabled={isSeeding}
                      className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 text-sm shrink-0 whitespace-nowrap"
                    >
                      {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />} 
                      {isSeeding ? 'Importing...' : 'Sync Demo Content'}
                    </button>
                  </div>
                )}
              </motion.section>
            )}

            {/* Gallery Management */}
            {activeTab === 'gallery' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Gallery</h2>
                    <p className="text-[#a1a1aa] text-sm">Manage the images displayed in your portfolio grid.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-1 h-fit sticky top-32">
                    <div className="bg-[#171717] border border-white/10 p-6 rounded-2xl flex flex-col">
                      <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2 uppercase tracking-widest"><Plus size={14} className="text-white/50" /> Upload Image</h3>
                      
                      <div 
                        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30 bg-black/40'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                      >
                        <ImageIcon size={32} className={`mx-auto mb-3 ${isDragging ? 'text-emerald-400' : 'text-white/30'}`} />
                        <p className="text-sm font-medium text-white mb-1">Drag & Drop Image</p>
                        <p className="text-xs text-[#71717a] mb-4">PNG, JPG up to 10MB</p>
                        <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors block w-max mx-auto">
                          Browse Files
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
                          }} />
                        </label>
                      </div>

                      <div className="relative mb-6">
                         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                         <div className="relative flex justify-center text-xs"><span className="bg-[#171717] px-2 text-[#71717a]">OR USE URL</span></div>
                      </div>

                      <form onSubmit={handleAddImage} className="space-y-4">
                        <div>
                          <input 
                            type="url" 
                            value={newImgUrl} 
                            onChange={e => { setNewImgUrl(e.target.value); setPreviewError(false); }} 
                            placeholder="https:// image url..." 
                            className="w-full bg-black/40 border border-white/10 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                            required
                          />
                        </div>
                        
                        {newImgUrl && (
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                            {!previewError ? (
                              <img 
                                src={newImgUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                onError={() => setPreviewError(true)}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
                                <AlertTriangle size={24} className="mb-2 opacity-50" />
                                <span className="text-xs">Invalid image URL</span>
                              </div>
                            )}
                          </div>
                        )}

                        <button type="submit" className="w-full bg-white text-black py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e0e0e0] hover:scale-[1.01] transition-all flex items-center justify-center gap-2" disabled={isSaving || previewError || !newImgUrl}>
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                          Publish Image
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {gallery.map(img => (
                        <div key={img.id} className="relative group aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-sm transform transition-all hover:scale-[1.05] hover:z-10">
                          <img src={img.url} alt="Gallery" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                            <button 
                              onClick={() => setDeleteConfirm({ isOpen: true, type: 'gallery', id: img.id })}
                              className="bg-white/10 backdrop-blur-md hover:bg-red-500 text-white border border-white/20 hover:border-red-500 px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {gallery.length === 0 && (
                      <div className="py-24 text-center text-[#71717a] border border-dashed border-white/10 rounded-2xl flex flex-col items-center bg-[#171717]">
                        <ImageIcon size={32} className="mb-4 opacity-50" />
                        <p>No gallery images found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Services Management */}
            {activeTab === 'services' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Services</h2>
                    <p className="text-[#a1a1aa] text-sm">Control pricing, packages, and features listed on your site.</p>
                  </div>
                  {!editingService && (
                    <button onClick={handleCreateNewService} className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-xl px-5 py-2.5 transition-all hover:bg-[#e0e0e0] shadow-sm">
                      <Plus size={16} /> New Service
                    </button>
                  )}
                </div>

                {editingService ? (
                  <div className="bg-[#171717] border border-white/10 p-8 rounded-2xl mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                      <h3 className="text-xl font-bold text-white">{editingService.id ? 'Edit Configuration' : 'Create Package'}</h3>
                      <button onClick={() => setEditingService(null)} className="text-[#a1a1aa] hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleSaveService} className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Core Details */}
                        <div className="space-y-6">
                          <h4 className="text-sm font-semibold uppercase tracking-widest text-[#a1a1aa]">Core Identity</h4>
                          <div className="space-y-5">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-2">Service Title</label>
                              <input type="text" required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. Interior Detail" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-2">Subtitle / Tagline</label>
                              <input type="text" value={editingService.subtitle} onChange={e => setEditingService({...editingService, subtitle: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. Clean & Refresh" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-semibold text-white/70 mb-2 flex justify-between">
                                  <span>Home Page Desc</span>
                                  <span className="text-white/30 font-normal">{editingService.desc?.length || 0}/100</span>
                                </label>
                                <input type="text" required value={editingService.desc || ''} onChange={e => setEditingService({...editingService, desc: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="Short intro..." maxLength={100} />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-semibold text-white/70 mb-2">Sticker Price</label>
                                <input type="text" value={editingService.price || ''} onChange={e => setEditingService({...editingService, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="Starts at $150" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-2">Long Description (Services Page)</label>
                              <textarea required value={editingService.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none" placeholder="Elaborate on the service..." />
                            </div>
                          </div>
                        </div>

                        {/* Media & Features */}
                        <div className="space-y-6">
                          <h4 className="text-sm font-semibold uppercase tracking-widest text-[#a1a1aa]">Media & Inclusion</h4>
                          <div className="space-y-5">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-2">Cover Image URL</label>
                              <input type="url" required value={editingService.img || ''} onChange={e => setEditingService({...editingService, img: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all mb-3" placeholder="https://..." />
                              {editingService.img && (
                                <div className="w-full aspect-[21/9] bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner hidden sm:block">
                                  <img src={editingService.img} alt="Preview" className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-white/10">
                              <div className="flex justify-between items-center mb-4">
                                <label className="text-xs font-semibold text-white/70 flex items-center gap-2">
                                  Included Features
                                </label>
                                <button 
                                  type="button" 
                                  onClick={() => setEditingService({...editingService, features: [...(editingService.features || []), '']})}
                                  className="text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1 text-[#d4d4d8] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
                                >
                                  <Plus size={12} /> Add Row
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(editingService.features || []).map((f: string, i: number) => (
                                  <div key={i} className="relative flex items-center group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] text-white/50">{i+1}</div>
                                    <input 
                                      type="text" 
                                      value={f} 
                                      onChange={e => {
                                        const newFeatures = [...editingService.features];
                                        newFeatures[i] = e.target.value;
                                        setEditingService({...editingService, features: newFeatures});
                                      }} 
                                      placeholder="Feature text..."
                                      className="w-full bg-black/40 border border-transparent hover:border-white/10 focus:border-white/30 rounded-lg text-white text-sm pl-10 pr-10 py-2.5 outline-none transition-all" 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const newFeatures = [...editingService.features];
                                        newFeatures.splice(i, 1);
                                        setEditingService({...editingService, features: newFeatures});
                                      }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                                {(!editingService.features || editingService.features.length === 0) && (
                                  <p className="text-xs text-[#71717a] italic p-4 text-center border border-dashed border-white/10 rounded-lg">No features added yet.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-[#0a0a0a]/50 -mx-8 -mb-8 p-6 mt-8 border-t border-white/10 rounded-b-2xl">
                        {editingService.id ? (
                          <button type="button" onClick={() => setDeleteConfirm({ isOpen: true, type: 'service', id: editingService.id })} className="text-red-500 hover:text-red-400 font-medium transition-colors flex items-center gap-2 text-sm px-4 py-2 rounded-xl hover:bg-red-500/10" disabled={isSaving}>
                            <Trash2 size={16} /> Delete
                          </button>
                        ) : <div></div>}
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditingService(null)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all" disabled={isSaving}>
                            Discard
                          </button>
                          <button type="submit" className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e0e0e0] hover:scale-[1.02] transition-all flex items-center gap-2 shadow-sm" disabled={isSaving}>
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            Save Package
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pointer-events-auto">
                    {services.map(service => (
                      <div key={service.id} className="bg-[#171717] border border-white/10 p-5 flex flex-col sm:flex-row gap-5 rounded-2xl group hover:border-white/20 hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-sm relative overflow-hidden" onClick={() => handleEditService(service)}>
                        <div className="w-full sm:w-32 aspect-video sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-black/50 relative">
                          <img src={service.img} alt={service.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col justify-center flex-grow py-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-lg font-bold text-white tracking-tight">{service.title}</h3>
                            </div>
                            <p className="text-sm font-medium text-emerald-400 mb-2">{service.price}</p>
                            <p className="text-[#a1a1aa] text-xs line-clamp-2 leading-relaxed">{service.desc}</p>
                          </div>
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 text-[10px] uppercase font-bold tracking-widest text-[#d4d4d8] transition-all duration-300 flex items-center gap-2">
                            Edit Service <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && (
                      <div className="col-span-full py-24 text-center text-[#71717a] border border-dashed border-white/10 rounded-2xl flex flex-col items-center bg-[#171717]">
                        <Settings2 size={32} className="mb-4 opacity-50" />
                        <p className="mb-4 text-sm font-medium">No services configured yet.</p>
                        <button onClick={handleCreateNewService} className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#e0e0e0] transition-colors shadow-sm">Build First Service</button>
                      </div>
                    )}
                  </div>
                )}
              </motion.section>
            )}

            {/* Inbox */}
            {activeTab === 'inbox' && (
              <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">Inbound <span className="text-white/30">Leads</span></h2>
                    <p className="text-[#a1a1aa] text-sm font-medium">Capture intelligence and drive conversions in real-time.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                       <input 
                         type="text" 
                         placeholder="Search leads..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full bg-[#171717] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/30 transition-all outline-none"
                       />
                    </div>
                    <div className="flex bg-[#171717] p-1 rounded-xl border border-white/10">
                       <button onClick={() => setFilterStatus('all')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>All</button>
                       <button onClick={() => setFilterStatus('unread')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === 'unread' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-white/40 hover:text-white'}`}>New</button>
                       <button onClick={() => setFilterStatus('read')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === 'read' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>Seen</button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#171717] border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-3xl">
                  {filteredLeads.length === 0 ? (
                    <div className="py-32 text-center flex flex-col items-center justify-center text-[#71717a]">
                      <Inbox size={48} className="mb-6 opacity-20" />
                      <p className="text-sm font-medium text-[#a1a1aa]">Inbox Zero</p>
                      <p className="text-xs mt-1">You have no new leads to review.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02] text-[#71717a] text-[10px] uppercase font-bold tracking-widest">
                        <div className="w-4"></div>
                        <div>Customer</div>
                        <div className="hidden sm:block">Interest</div>
                        <div className="text-right">Received</div>
                      </div>
                      
                      {filteredLeads.map((lead) => (
                        <div key={lead.id} className="border-b border-white/5 last:border-b-0 group relative overflow-hidden">
                          <div 
                            className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 md:px-8 py-5 items-center cursor-pointer transition-all hover:bg-white/[0.04] ${!lead.read ? 'bg-white/[0.02]' : ''}`}
                            onClick={() => {
                              if (!lead.read) {
                                markLeadRead(lead.id);
                              }
                              setExpandedLead(expandedLead === lead.id ? null : lead.id);
                            }}
                          >
                            <div className="w-2 flex justify-center">
                              {!lead.read ? (
                                <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-transparent"></span>
                              )}
                            </div>
                            <div className="truncate pr-4">
                              <span className={`block truncate ${!lead.read ? 'text-white font-semibold' : 'text-[#d4d4d8]'}`}>{lead.firstName} {lead.lastName}</span>
                              <span className="text-[#a1a1aa] text-xs truncate block">{lead.email}</span>
                            </div>
                            <div className={`hidden sm:block truncate text-xs ${!lead.read ? 'text-[#d4d4d8] font-medium' : 'text-[#71717a]'}`}>
                              {lead.service || 'General Inquiry'}
                            </div>
                            <div className={`text-right text-xs whitespace-nowrap ${!lead.read ? 'text-[#d4d4d8] font-medium' : 'text-[#71717a]'}`}>
                              {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedLead === lead.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-[#0f0f0f] overflow-hidden border-t border-white/5"
                              >
                                <div className="p-8">
                                  <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl font-bold">
                                        {lead.firstName.charAt(0)}{lead.lastName ? lead.lastName.charAt(0) : ''}
                                      </div>
                                      <div>
                                        <h4 className="text-white text-lg font-bold">{lead.firstName} {lead.lastName}</h4>
                                        <a href={`mailto:${lead.email}`} className="text-[#a1a1aa] hover:text-white transition-colors text-sm flex items-center gap-1"><MailOpen size={12}/> {lead.email}</a>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[#71717a] text-xs block mb-1">Received On</span>
                                      <span className="text-white text-sm font-medium">{new Date(lead.createdAt).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="p-5 bg-[#171717] rounded-xl border border-white/5">
                                      <span className="block text-[10px] uppercase font-bold tracking-widest text-[#71717a] mb-2">Service Interest</span>
                                      <span className="text-white font-medium">{lead.service || '--'}</span>
                                    </div>
                                    <div className="p-5 bg-[#171717] rounded-xl border border-white/5">
                                      <span className="block text-[10px] uppercase font-bold tracking-widest text-[#71717a] mb-2">Vehicle Configuration</span>
                                      <span className="text-white font-medium">{lead.vehicle || '--'}</span>
                                    </div>
                                  </div>

                                  <div className="mb-8">
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#71717a] mb-3">Customer Message</span>
                                    <div className="bg-[#171717] rounded-xl border border-white/5 p-6 text-[#d4d4d8] text-sm leading-relaxed whitespace-pre-wrap">
                                      {lead.message || <span className="italic text-[#71717a]">No additional message provided.</span>}
                                    </div>
                                  </div>

                                  <div className="flex justify-end pt-6 border-t border-white/5">
                                    <button 
                                      onClick={() => setDeleteConfirm({ isOpen: true, type: 'lead', id: lead.id })}
                                      className="text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-2"
                                    >
                                      <Trash2 size={16} /> Delete Record
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Pages & Globals */}
            {(activeTab === 'pages' || activeTab === 'settings') && (
              <motion.section 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-[#171717]/50 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-1 uppercase">{activeTab === 'pages' ? 'Content Architect' : 'System Engine'}</h2>
                    <p className="text-[#a1a1aa] text-sm font-medium">{activeTab === 'pages' ? 'Visually edit and refine every word of your landing experience.' : 'Configure the underlying meta-data and search engine intelligence.'}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      setIsSaving(true);
                      await saveSettings(editingSettings);
                      setIsSaving(false);
                      showToast('Cloud configuration synchronized');
                    }}
                    disabled={isSaving}
                    className="w-full md:w-auto bg-white text-black px-8 py-3.5 font-black rounded-2xl hover:bg-[#d1d1d1] transition-all flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.15)] active:scale-95"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />} Sync All Changes
                  </button>
                </div>

                {activeTab === 'pages' && (
                  <div className="space-y-8">
                     {/* Sub Tabs for Pages */}
                     <div className="flex gap-2 bg-[#171717] p-1.5 rounded-2xl border border-white/5 w-fit">
                        {['home', 'about', 'contact'].map((p) => (
                           <button 
                             key={p}
                             onClick={() => setPageSubTab(p as any)}
                             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${pageSubTab === p ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                           >
                              {p}
                           </button>
                        ))}
                     </div>

                    {pageSubTab === 'home' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none"><FileText size={160}/></div>
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <LayoutDashboard size={20} />
                           </div>
                           <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Home Engine</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                          <ControlInput label="Eyebrow Badge" value={editingSettings?.home?.heroPreTitle} onChange={(v: string) => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroPreTitle: v}})} placeholder="e.g. Certified ceramic installers" />
                          <ControlInput label="Headline Line 1" value={editingSettings?.home?.heroTitle1} onChange={(v: string) => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroTitle1: v}})} />
                          <ControlInput label="Headline Line 2 (Accent)" value={editingSettings?.home?.heroTitle2} onChange={(v: string) => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroTitle2: v}})} />
                          <ControlInput label="Background Media URL" value={editingSettings?.home?.heroBg} onChange={(v: string) => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroBg: v}})} type="url" />
                          <div className="md:col-span-2">
                             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] mb-3">Narrative Copy</label>
                             <textarea value={editingSettings?.home?.heroDesc || ''} onChange={(e: any) => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroDesc: e.target.value}})} className="w-full bg-black/40 border border-white/5 rounded-2xl text-white px-6 py-4 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none font-medium leading-relaxed" placeholder="Write the main pitch..." />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {pageSubTab === 'about' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                        <h3 className="text-xl font-black italic text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                           <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-sans italic not-italic font-black">A</div>
                           Origin Story
                        </h3>
                        <div className="space-y-8 relative z-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ControlInput label="Section Intro" value={editingSettings?.about?.eyebrow} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, eyebrow: v}})} />
                            <div className="space-y-3">
                               <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a]">Dual Tone Headline</label>
                               <div className="flex gap-4">
                                  <input type="text" value={editingSettings?.about?.title1 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, title1: e.target.value}})} className="w-full bg-black/40 border border-white/5 rounded-xl text-white px-5 py-3 text-sm outline-none focus:border-white/30 transition-all font-medium" />
                                  <input type="text" value={editingSettings?.about?.title2 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, title2: e.target.value}})} className="w-full bg-black/40 border border-white/5 rounded-xl text-white px-5 py-3 text-sm outline-none focus:border-white/30 transition-all font-serif italic" />
                               </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <ControlTextArea label="Philosophy Block" value={editingSettings?.about?.p1} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p1: v}})} />
                             <ControlTextArea label="Technique Block" value={editingSettings?.about?.p2} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p2: v}})} />
                             <ControlTextArea label="Vision Block" value={editingSettings?.about?.p3} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p3: v}})} />
                          </div>
                          <ControlInput label="Founder / Location Imagery" value={editingSettings?.about?.image} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, image: v}})} type="url" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                             <ControlInput label="Certifications" value={editingSettings?.about?.certs} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, certs: v}})} />
                             <ControlInput label="Legal / Insurance" value={editingSettings?.about?.license} onChange={(v: string) => setEditingSettings({...editingSettings, about: {...editingSettings?.about, license: v}})} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {pageSubTab === 'contact' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                        <h3 className="text-xl font-black italic text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                           <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><MailOpen size={20}/></div>
                           Global Channels
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                          <ControlInput label="Telephone" value={editingSettings?.contact?.phone} onChange={(v: string) => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, phone: v}})} />
                          <ControlInput label="Email Support" value={editingSettings?.contact?.email} onChange={(v: string) => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, email: v}})} />
                          <ControlInput label="Operational Territory" value={editingSettings?.contact?.area} onChange={(v: string) => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, area: v}})} />
                          <ControlInput label="Business Hours" value={editingSettings?.contact?.hours} onChange={(v: string) => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, hours: v}})} />
                          <div className="md:col-span-4 pt-4">
                             <ControlInput label="Universal Branding Asset (Logo URL)" value={editingSettings?.logoUrl} onChange={(v: string) => setEditingSettings({...editingSettings, logoUrl: v})} type="url" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-8">
                        <div className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                           <div className="flex items-center gap-3 mb-8">
                              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                 <Bell size={20} />
                              </div>
                              <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Announcement Strip</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                              <div className="flex items-center gap-4">
                                 <div 
                                    onClick={() => setEditingSettings({...editingSettings, banner: {...editingSettings?.banner, enabled: !editingSettings?.banner?.enabled}})}
                                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${editingSettings?.banner?.enabled ? 'bg-indigo-500' : 'bg-white/10'}`}
                                 >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-xl transition-all ${editingSettings?.banner?.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                 </div>
                                 <span className="text-xs font-black uppercase tracking-widest text-[#a1a1aa]">Banner Active</span>
                              </div>
                              <ControlInput label="Scroll Velocity" value={editingSettings?.banner?.speed} onChange={(v: string) => setEditingSettings({...editingSettings, banner: {...editingSettings?.banner, speed: parseInt(v) || 30}})} type="number" />
                              <div className="md:col-span-2">
                                 <ControlInput label="Strip Message" value={editingSettings?.banner?.text} onChange={(v: string) => setEditingSettings({...editingSettings, banner: {...editingSettings?.banner, text: v}})} placeholder="e.g. 50% Off First-Time Ceramic Coatings — Limited Availability" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                           <h3 className="text-sm font-black uppercase tracking-widest text-[#71717a] mb-8 flex items-center gap-2"><CheckCircle2 size={16} /> External Systems</h3>
                           <div className="space-y-6 relative z-10">
                              <ControlInput label="Google Analytics ID" value={editingSettings?.analytics?.gaId} onChange={(v: string) => setEditingSettings({...editingSettings, analytics: {...editingSettings?.analytics, gaId: v}})} placeholder="G-XXXXXXXXXX" />
                              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                 <p className="text-xs text-[#71717a] leading-relaxed font-medium">System is running in optimized mode. Cloud synchronization is active. All edits are pushed to the edge network upon clicking "Sync All Changes".</p>
                              </div>
                           </div>
                           <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 blur-3xl rounded-full"></div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-[#171717] p-8 border border-white/10 rounded-[2.5rem] shadow-sm h-fit">
                           <h3 className="text-sm font-black uppercase tracking-widest text-[#71717a] mb-8 flex items-center gap-2"><BarChart3 size={16} /> Technical SEO</h3>
                           <div className="space-y-6">
                              <ControlInput label="Browser Title" value={editingSettings?.seo?.title} onChange={(v: string) => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, title: v}})} placeholder="Brand | Service" />
                              <ControlTextArea label="Search Snippet" value={editingSettings?.seo?.description} onChange={(v: string) => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, description: v}})} />
                              <ControlInput label="Keywords Index" value={editingSettings?.seo?.keywords} onChange={(v: string) => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, keywords: v}})} placeholder="comma, separated, tags" />
                           </div>
                        </div>

                        <div className="bg-red-500/5 p-8 border border-red-500/10 rounded-[2.5rem] shadow-sm">
                           <h3 className="text-sm font-black uppercase tracking-widest text-red-400 mb-6 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h3>
                           <button 
                              disabled={isSeeding}
                              onClick={handleSeedData} 
                              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95 disabled:opacity-50"
                           >
                              {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />} Reset Site Data
                           </button>
                        </div>
                     </div>
                  </div>
                )}
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
