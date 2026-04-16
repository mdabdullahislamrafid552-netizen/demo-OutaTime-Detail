import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { subscribeToServices, subscribeToGallery, addGalleryImage, deleteGalleryImage, saveService, deleteService, subscribeToLeads, markLeadRead, deleteLead, seedDefaults } from '../lib/cms';
import { Plus, Trash2, LogOut, CheckCircle2, Image as ImageIcon, Settings2, X, AlertTriangle, LayoutDashboard, Loader2, ArrowRight, Inbox, MailOpen, DownloadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ALLOWED_EMAILS = ['mdabdullahislamrafid552@gmail.com'];

export default function Admin() {
  const [user, setUser] = useState<any>({ email: 'admin@system.local', displayName: 'System Admin' });
  const [services, setServices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'services' | 'inbox'>('overview');

  // UI States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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

  useEffect(() => {
    const unsubServices = subscribeToServices(setServices);
    const unsubGallery = subscribeToGallery(setGallery);
    const unsubLeads = subscribeToLeads(setLeads);
    return () => {
      unsubServices();
      unsubGallery();
      unsubLeads();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>;

  const handleAddImage = async (e: any) => {
    e.preventDefault();
    if (!newImgUrl || previewError) {
      showToast('Please provide a valid image URL', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await addGalleryImage(newImgUrl, newImgCaption);
      setNewImgUrl('');
      setNewImgCaption('');
      setPreviewError(false);
      showToast('Image added to gallery seamlessly');
    } catch (e) {
      showToast('Failed to add image', 'error');
    }
    setIsSaving(false);
  };

  const handleSaveService = async (e: any) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    try {
      await saveService(editingService);
      setEditingService(null);
      showToast('Service updated successfully');
    } catch (e) {
      showToast('Failed to save service', 'error');
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsSaving(true);
    try {
      if (deleteConfirm.type === 'gallery') {
        await deleteGalleryImage(deleteConfirm.id);
        showToast('Image removed');
      } else if (deleteConfirm.type === 'service') {
        await deleteService(deleteConfirm.id);
        setEditingService(null);
        showToast('Service deleted');
      } else if (deleteConfirm.type === 'lead') {
        await deleteLead(deleteConfirm.id);
        showToast('Lead deleted');
      }
    } catch (e) {
      showToast('Action failed', 'error');
    }
    setDeleteConfirm(null);
    setIsSaving(false);
  };

  const handleCreateNewService = () => {
    setEditingService({
      title: '',
      subtitle: '',
      desc: '',
      description: '',
      features: ['', '', '', ''],
      icon: 'Sparkles',
      img: '',
      order: services.length
    });
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' ? 'bg-black/80 border-white/20 text-white' : 'bg-red-950/80 border-red-500/30 text-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-white/70" /> : <AlertTriangle size={16} className="text-red-400" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 p-8 rounded-sm shadow-2xl max-w-md w-full"
            >
              <h3 className="text-2xl font-serif text-white mb-2">Confirm Deletion</h3>
              <p className="text-[#d1d1d1]/70 mb-8 font-light">Are you sure you want to permanently delete this {deleteConfirm.type}? This action cannot be undone.</p>
              <div className="flex gap-4 justify-end">
                <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2 text-white/70 hover:text-white transition-colors" disabled={isSaving}>Cancel</button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 transition-colors flex items-center gap-2" disabled={isSaving}>
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-64 shrink-0 flex flex-col md:border-r border-white/5 md:pr-8 md:min-h-[70vh]">
          <div className="mb-12">
            <h1 className="text-3xl font-serif text-white mb-2">Workspace</h1>
            <p className="text-[#d1d1d1]/50 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 
              <span className="truncate">{user.email}</span>
            </p>
          </div>
          
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar scroll-smooth">
            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap text-sm font-medium ${activeTab === 'overview' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <LayoutDashboard size={18} /> Overview
            </button>
            <button onClick={() => setActiveTab('inbox')} className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap text-sm font-medium relative ${activeTab === 'inbox' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <Inbox size={18} /> Inbox
              {unreadLeadsCount > 0 && (
                <span className={`ml-auto px-2 py-0.5 text-[10px] rounded-full font-bold ${activeTab === 'inbox' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                  {unreadLeadsCount}
                </span>
              )}
            </button>
            <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap text-sm font-medium ${activeTab === 'gallery' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <ImageIcon size={18} /> Gallery
            </button>
            <button onClick={() => setActiveTab('services')} className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all whitespace-nowrap text-sm font-medium ${activeTab === 'services' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <Settings2 size={18} /> Services
            </button>
            
            <div className="h-px bg-white/5 my-4 mx-4 hidden md:block"></div>
          </nav>
        </div>

        <div className="flex-grow pt-4 md:pt-0">
        {activeTab === 'overview' && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <h2 className="text-3xl font-serif text-white">Welcome back, Admin.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111] border border-white/5 p-8 rounded-sm hover:border-white/20 transition-colors group cursor-pointer" onClick={() => setActiveTab('inbox')}>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors relative">
                  <Inbox size={24} className="text-white/80" />
                  {unreadLeadsCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#111]"></span>
                  )}
                </div>
                <h3 className="text-xl text-white mb-2 flex items-center gap-3">
                  Lead Inbox
                  {unreadLeadsCount > 0 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{unreadLeadsCount} new</span>}
                </h3>
                <p className="text-[#d1d1d1]/50 text-sm mb-6">Review contact form submissions and booking requests. Currently tracking {leads.length} leads.</p>
                <div className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center gap-2">Open Inbox <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
              </div>
              <div className="bg-[#111] border border-white/5 p-8 rounded-sm hover:border-white/20 transition-colors group cursor-pointer" onClick={() => setActiveTab('gallery')}>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  <ImageIcon size={24} className="text-white/80" />
                </div>
                <h3 className="text-xl text-white mb-2">Manage Gallery</h3>
                <p className="text-[#d1d1d1]/50 text-sm mb-6">Upload or remove images from the masonry grid on the gallery page. Currently hosting {gallery.length} images.</p>
                <div className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center gap-2">Open Gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
              </div>
              <div className="bg-[#111] border border-white/5 p-8 rounded-sm hover:border-white/20 transition-colors group cursor-pointer" onClick={() => setActiveTab('services')}>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  <Settings2 size={24} className="text-white/80" />
                </div>
                <h3 className="text-xl text-white mb-2">Manage Services</h3>
                <p className="text-[#d1d1d1]/50 text-sm mb-6">Edit your detailing packages, update pricing, descriptions, and feature lists. Currently offering {services.length} services.</p>
                <div className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center gap-2">Open Services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
              </div>
            </div>

            {services.length === 0 && gallery.length === 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-sm mt-8">
                <h3 className="text-xl text-yellow-500 mb-2 font-serif flex items-center gap-2">
                  <AlertTriangle size={20} /> Initial Setup Required
                </h3>
                <p className="text-[#d1d1d1]/80 text-sm mb-6 max-w-xl">
                  It looks like your admin database is completely empty. Click the button below to instantly import all default site content (gallery images and services) into the editable dashboard.
                </p>
                <button 
                  onClick={handleSeedData} 
                  disabled={isSeeding}
                  className="bg-yellow-500 text-black px-6 py-2.5 font-medium hover:bg-yellow-400 transition-colors flex items-center gap-2 text-sm"
                >
                  {isSeeding ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />} 
                  {isSeeding ? 'Importing Content...' : 'Sync Live Site Content'}
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
                <h2 className="text-2xl font-serif text-white mb-2">Gallery Manager</h2>
                <p className="text-[#d1d1d1]/50 text-sm">Add high-quality images to showcase your work.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-[#111] border border-white/5 p-6 rounded-sm md:col-span-1 h-fit sticky top-24">
                <h3 className="text-lg text-white mb-6 flex items-center gap-2"><Plus size={18} className="text-white/50" /> Add New Image</h3>
                <form onSubmit={handleAddImage} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2">Image URL</label>
                    <input 
                      type="url" 
                      value={newImgUrl} 
                      onChange={e => { setNewImgUrl(e.target.value); setPreviewError(false); }} 
                      placeholder="https://..." 
                      className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                  
                  {newImgUrl && (
                    <div className="relative aspect-video rounded-sm overflow-hidden bg-[#171717] border border-white/10">
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

                  <button type="submit" className="w-full bg-white text-black py-3 font-medium hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2" disabled={isSaving || previewError || !newImgUrl}>
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                    Upload to Gallery
                  </button>
                </form>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map(img => (
                  <div key={img.id} className="relative group aspect-square overflow-hidden rounded-sm border border-white/5 bg-[#171717]">
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, type: 'gallery', id: img.id })}
                        className="bg-red-500 hover:bg-red-600 text-white border border-red-500/50 p-3 rounded-full transition-all shadow-lg"
                        title="Delete Image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full py-20 text-center text-[#d1d1d1]/40 border border-dashed border-white/10 flex flex-col items-center">
                    <ImageIcon size={32} className="mb-4 opacity-50" />
                    <p>No images in gallery yet.</p>
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
                <h2 className="text-2xl font-serif text-white mb-2">Service Manager</h2>
                <p className="text-[#d1d1d1]/50 text-sm">Configure your detailing packages and pricing.</p>
              </div>
              {!editingService && (
                <button onClick={handleCreateNewService} className="flex items-center gap-2 text-sm bg-white text-black px-5 py-2 transition-colors hover:bg-[#e0e0e0]">
                  <Plus size={16} /> Add Package
                </button>
              )}
            </div>

            {editingService ? (
              <div className="bg-[#111] border border-white/5 p-8 rounded-sm mb-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                  <h3 className="text-2xl font-serif text-white">{editingService.id ? 'Edit Package' : 'New Package'}</h3>
                  <button onClick={() => setEditingService(null)} className="text-[#d1d1d1]/50 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSaveService} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    {/* Left Column: Core Details */}
                    <div className="lg:col-span-3 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2">Display Title</label>
                          <input type="text" required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors" placeholder="e.g. Full Detail" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2">Tagline (Subtitle)</label>
                          <input type="text" value={editingService.subtitle} onChange={e => setEditingService({...editingService, subtitle: e.target.value})} className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors" placeholder="e.g. The Complete Reset" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2 flex justify-between">
                          <span>Home Page Snippet</span>
                          <span className="text-white/30">{editingService.desc.length}/100</span>
                        </label>
                        <input type="text" required value={editingService.desc} onChange={e => setEditingService({...editingService, desc: e.target.value})} className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors" placeholder="Brief 1-sentence overview..." maxLength={100} />
                      </div>
                      
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2">Full Description</label>
                        <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors h-32 resize-none leading-relaxed" placeholder="Detailed paragraph about what this package entails..." />
                      </div>
                    </div>

                    {/* Right Column: Media & Features */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-2">Cover Image URL</label>
                        <input type="url" required value={editingService.img} onChange={e => setEditingService({...editingService, img: e.target.value})} className="w-full bg-[#171717] border border-white/10 text-white px-4 py-3 outline-none focus:border-white/30 transition-colors mb-3" placeholder="https://..." />
                        {editingService.img && (
                          <div className="w-full aspect-[21/9] bg-[#171717] border border-white/5 rounded-sm overflow-hidden">
                            <img src={editingService.img} alt="Preview" className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <label className="block text-xs uppercase tracking-wider text-[#d1d1d1]/50 mb-6 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Key Features (Bullet Points)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {editingService.features.map((f: string, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs">{i+1}</div>
                          <input 
                            type="text" 
                            value={f} 
                            onChange={e => {
                              const newFeatures = [...editingService.features];
                              newFeatures[i] = e.target.value;
                              setEditingService({...editingService, features: newFeatures});
                            }} 
                            placeholder={`Add a selling point...`}
                            className="w-full bg-[#171717] border border-white/10 text-white pl-10 pr-4 py-3 outline-none focus:border-white/30 transition-colors" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#0a0a0a] -mx-8 -mb-8 p-6 mt-8 border-t border-white/5">
                    {editingService.id ? (
                      <button type="button" onClick={() => setDeleteConfirm({ isOpen: true, type: 'service', id: editingService.id })} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm" disabled={isSaving}>
                        <Trash2 size={16} /> Remove Package
                      </button>
                    ) : <div></div>}
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setEditingService(null)} className="px-6 py-2 text-white/70 hover:text-white transition-colors text-sm" disabled={isSaving}>
                        Discard
                      </button>
                      <button type="submit" className="bg-white text-black px-8 py-2 font-medium hover:bg-[#e0e0e0] transition-colors flex items-center gap-2" disabled={isSaving}>
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Save Package
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.map(service => (
                  <div key={service.id} className="bg-[#111] border border-white/5 p-6 flex flex-col sm:flex-row gap-6 rounded-sm group hover:border-white/20 hover:bg-[#151515] transition-all cursor-pointer shadow-lg hover:shadow-xl" onClick={() => handleEditService(service)}>
                    <div className="w-full sm:w-32 aspect-video sm:aspect-square shrink-0 rounded-sm overflow-hidden bg-[#171717] relative">
                      <img src={service.img} alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="flex flex-col justify-between flex-grow py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xl text-white font-serif">{service.title}</h3>
                        </div>
                        <p className="text-[#d1d1d1]/50 text-sm line-clamp-2 mt-2 leading-relaxed">{service.desc}</p>
                      </div>
                      <div className="mt-4 text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/80 transition-colors flex items-center gap-2">
                        Configure Settings <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="col-span-full py-20 text-center text-[#d1d1d1]/40 border border-dashed border-white/10 flex flex-col items-center">
                    <Settings2 size={32} className="mb-4 opacity-50" />
                    <p className="mb-4">No services configured yet.</p>
                    <button onClick={handleCreateNewService} className="bg-white text-black px-6 py-2 rounded-sm text-sm hover:bg-[#e0e0e0] transition-colors">Build First Package</button>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        )}

        {/* Lead Inbox Management */}
        {activeTab === 'inbox' && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-serif text-white mb-2">Lead Inbox</h2>
                <p className="text-[#d1d1d1]/50 text-sm">Review incoming contact requests and bookings.</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-sm overflow-hidden text-sm">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-white/10 text-white/40 uppercase tracking-widest text-[10px]">
                <div className="w-4"></div>
                <div>Contact</div>
                <div className="hidden sm:block">Service / Vehicle</div>
                <div className="text-right">Date</div>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-white/30">
                  <MailOpen size={32} className="mb-4 opacity-50" />
                  <p>Your inbox is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border-b border-white/5 last:border-b-0 group">
                      <div 
                        className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center cursor-pointer hover:bg-white/5 transition-colors ${!lead.read ? 'bg-white/[0.02]' : ''}`}
                        onClick={() => {
                          if (!lead.read) {
                            markLeadRead(lead.id);
                          }
                          setExpandedLead(expandedLead === lead.id ? null : lead.id);
                        }}
                      >
                        <div className="w-2 flex justify-center">
                          {!lead.read ? (
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-transparent"></span>
                          )}
                        </div>
                        <div className="truncate">
                          <span className={`block truncate ${!lead.read ? 'text-white font-medium' : 'text-white/70'}`}>{lead.firstName} {lead.lastName}</span>
                          <span className="text-white/40 text-xs truncate block">{lead.email}</span>
                        </div>
                        <div className="hidden sm:block truncate text-white/50 text-xs">
                          {lead.service || 'General Inquiry'}
                        </div>
                        <div className="text-right text-white/40 text-xs whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedLead === lead.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#0a0a0a] overflow-hidden"
                          >
                            <div className="p-6 border-l-2 border-l-red-500 m-4 ml-6 mr-6 rounded-r-sm space-y-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-white text-lg mb-1">{lead.firstName} {lead.lastName}</h4>
                                  <a href={`mailto:${lead.email}`} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">{lead.email}</a>
                                </div>
                                <div className="text-right text-white/40 text-xs">
                                  {new Date(lead.createdAt).toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#111] rounded-sm">
                                <div>
                                  <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Service</span>
                                  <span className="text-white/80">{lead.service || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Vehicle</span>
                                  <span className="text-white/80">{lead.vehicle || 'N/A'}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="block text-[10px] uppercase tracking-widest text-white/40">Message</span>
                                <p className="text-white/80 leading-relaxed font-light bg-[#111] p-4 rounded-sm whitespace-pre-wrap">
                                  {lead.message || <span className="italic opacity-50">No message provided.</span>}
                                </p>
                              </div>

                              <div className="flex justify-end pt-4 border-t border-white/10">
                                <button 
                                  onClick={() => setDeleteConfirm({ isOpen: true, type: 'lead', id: lead.id })}
                                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-xs"
                                >
                                  <Trash2 size={14} /> Delete Lead
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

      </div>
      </div>
    </div>
  );
}
