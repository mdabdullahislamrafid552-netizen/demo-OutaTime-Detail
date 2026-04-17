import fs from 'fs';

const content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

const returnIndex = content.indexOf('  return (');
if (returnIndex === -1) {
  console.log("Could not find 'return ('");
  process.exit(1);
}

const beforeReturn = content.slice(0, returnIndex);

const newRender = `  return (
    <div className="min-h-screen -mt-24 pt-32 pb-24 px-4 md:px-8 w-full bg-[#0a0a0a] text-[#d1d1d1] font-sans">
      <div className="max-w-[1400px] mx-auto relative">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={\`fixed top-28 left-1/2 z-50 px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 backdrop-blur-xl border \${
                toast.type === 'success' ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/10 border-red-500/30 text-red-100'
              }\`}
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

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0 flex flex-col md:border-r border-white/10 md:pr-8 md:min-h-[80vh]">
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
            
            <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar scroll-smooth">
              <button onClick={() => setActiveTab('overview')} className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'overview' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <LayoutDashboard size={18} /> Overview
              </button>
              <button onClick={() => setActiveTab('inbox')} className={\`flex justify-between items-center px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'inbox' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <div className="flex items-center gap-3"><Inbox size={18} /> Inbox</div>
                {unreadLeadsCount > 0 && (
                  <span className={\`px-2 py-0.5 text-[10px] rounded-full font-bold \${activeTab === 'inbox' ? 'bg-black text-white' : 'bg-red-500 text-white'}\`}>
                    {unreadLeadsCount}
                  </span>
                )}
              </button>
              <div className="my-2 h-px w-full bg-white/5 mx-2 hidden md:block"></div>
              <button onClick={() => setActiveTab('services')} className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'services' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <Settings2 size={18} /> Services
              </button>
              <button onClick={() => setActiveTab('gallery')} className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'gallery' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <ImageIcon size={18} /> Gallery
              </button>
              <button onClick={() => setActiveTab('pages')} className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'pages' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <FileText size={18} /> Pages
              </button>
              <button onClick={() => setActiveTab('settings')} className={\`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-medium \${activeTab === 'settings' ? 'bg-white text-black shadow-md' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}\`}>
                <BarChart3 size={18} /> Settings & SEO
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow pt-4 md:pt-0 pb-32">
            {activeTab === 'overview' && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back.</h2>
                  <p className="text-[#a1a1aa] mt-1">Here is the overview of your detailing business today.</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-[#171717] border border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Inbox size={64}/></div>
                    <span className="text-[#a1a1aa] text-sm font-medium mb-4 z-10">Total Leads</span>
                    <span className="text-3xl font-bold text-white z-10">{leads.length}</span>
                  </div>
                  <div className="bg-[#171717] border border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><MailOpen size={64}/></div>
                    <span className="text-[#a1a1aa] text-sm font-medium mb-4 z-10">New Leads</span>
                    <div className="flex items-center gap-3 z-10">
                      <span className="text-3xl font-bold text-white">{unreadLeadsCount}</span>
                      {unreadLeadsCount > 0 && <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] rounded-lg font-bold uppercase tracking-wider">Unread</span>}
                    </div>
                  </div>
                  <div className="bg-[#171717] border border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Settings2 size={64}/></div>
                    <span className="text-[#a1a1aa] text-sm font-medium mb-4 z-10">Active Services</span>
                    <span className="text-3xl font-bold text-white z-10">{services.length}</span>
                  </div>
                  <div className="bg-[#171717] border border-white/10 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><ImageIcon size={64}/></div>
                    <span className="text-[#a1a1aa] text-sm font-medium mb-4 z-10">Gallery Images</span>
                    <span className="text-3xl font-bold text-white z-10">{gallery.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Recent Activity Panel */}
                  <div className="bg-[#171717] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                      <h3 className="font-semibold text-white">Recent Leads</h3>
                      <button onClick={() => setActiveTab('inbox')} className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={12}/>
                      </button>
                    </div>
                    <div className="flex-grow">
                      {leads.slice(0,4).map((lead, i) => (
                        <div key={i} className="px-5 py-4 border-b border-white/5 last:border-b-0 flex justify-between items-center hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={() => setActiveTab('inbox')}>
                          <div className="flex items-center gap-3">
                            <div className={\`w-2 h-2 rounded-full \${!lead.read ? 'bg-red-500' : 'bg-transparent'}\`}></div>
                            <div>
                              <p className={\`text-sm \${!lead.read ? 'text-white font-medium' : 'text-[#d4d4d8]'}\`}>{lead.firstName} {lead.lastName}</p>
                              <p className="text-xs text-[#71717a]">{lead.service || 'General Inquiry'}</p>
                            </div>
                          </div>
                          <span className="text-xs text-[#71717a]">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {leads.length === 0 && <div className="p-8 text-center text-[#71717a] text-sm">No recent activity.</div>}
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-[#171717] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-white/10 bg-white/[0.02]">
                      <h3 className="font-semibold text-white">Quick Actions</h3>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                      <button onClick={() => setActiveTab('services')} className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-3 text-[#d4d4d8]">
                        <Plus size={24} className="text-white/50" />
                        <span className="text-sm font-medium">Add Service</span>
                      </button>
                      <button onClick={() => setActiveTab('gallery')} className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-3 text-[#d4d4d8]">
                        <ImageIcon size={24} className="text-white/50" />
                        <span className="text-sm font-medium">Upload Image</span>
                      </button>
                      <button onClick={() => setActiveTab('pages')} className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-3 text-[#d4d4d8]">
                        <FileText size={24} className="text-white/50" />
                        <span className="text-sm font-medium">Edit Pages</span>
                      </button>
                      <button onClick={() => setActiveTab('settings')} className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-3 text-[#d4d4d8]">
                        <BarChart3 size={24} className="text-white/50" />
                        <span className="text-sm font-medium">Update SEO</span>
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
                      <form onSubmit={handleAddImage} className="space-y-5 lg:space-y-4">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {gallery.map(img => (
                        <div key={img.id} className="relative group aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#171717] shadow-sm">
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
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Lead Inbox</h2>
                    <p className="text-[#a1a1aa] text-sm">Review, respond, and manage booking requests.</p>
                  </div>
                </div>

                <div className="bg-[#171717] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                  {leads.length === 0 ? (
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
                      
                      {leads.map((lead) => (
                        <div key={lead.id} className="border-b border-white/5 last:border-b-0 group">
                          <div 
                            className={\`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center cursor-pointer transition-all hover:bg-white/[0.02] \${!lead.read ? 'bg-white/[0.03]' : ''}\`}
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
                              <span className={\`block truncate \${!lead.read ? 'text-white font-semibold' : 'text-[#d4d4d8]'}\`}>{lead.firstName} {lead.lastName}</span>
                              <span className="text-[#a1a1aa] text-xs truncate block">{lead.email}</span>
                            </div>
                            <div className={\`hidden sm:block truncate text-xs \${!lead.read ? 'text-[#d4d4d8] font-medium' : 'text-[#71717a]'}\`}>
                              {lead.service || 'General Inquiry'}
                            </div>
                            <div className={\`text-right text-xs whitespace-nowrap \${!lead.read ? 'text-[#d4d4d8] font-medium' : 'text-[#71717a]'}\`}>
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
                                        <a href={\`mailto:\${lead.email}\`} className="text-[#a1a1aa] hover:text-white transition-colors text-sm flex items-center gap-1"><MailOpen size={12}/> {lead.email}</a>
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

            {/* Pages & Globals - Similar transformation for settings tabs */}
            {(activeTab === 'pages' || activeTab === 'settings') && (
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{activeTab === 'pages' ? 'Content Editor' : 'SEO & System'}</h2>
                    <p className="text-[#a1a1aa] text-sm">{activeTab === 'pages' ? 'Visually edit text and copy across all static pages.' : 'Manage meta tags, analytics, and global system parameters.'}</p>
                  </div>
                  <button 
                    onClick={async () => {
                      setIsSaving(true);
                      await saveSettings(editingSettings);
                      setIsSaving(false);
                      showToast('Configuration synced fully');
                    }}
                    disabled={isSaving}
                    className="bg-white text-black px-6 py-2.5 font-bold rounded-xl hover:scale-[1.02] transition-all flex items-center gap-2 shadow-md"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Save Changes
                  </button>
                </div>

                {activeTab === 'pages' && (
                  <div className="space-y-8">
                    {/* Home */}
                    <div className="bg-[#171717] p-8 border border-white/10 rounded-2xl shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><FileText size={120}/></div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Home Page Structure</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Eyebrow Badge</label>
                          <input type="text" value={editingSettings?.home?.heroPreTitle || ''} onChange={e => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroPreTitle: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. Certified Ceramic Installers" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Line 1 Headline</label>
                          <input type="text" value={editingSettings?.home?.heroTitle1 || ''} onChange={e => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroTitle1: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. The Pinnacle Of" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Line 2 Headline (Accent)</label>
                          <input type="text" value={editingSettings?.home?.heroTitle2 || ''} onChange={e => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroTitle2: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. Auto Detailing." />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Hero Support Text</label>
                          <textarea value={editingSettings?.home?.heroDesc || ''} onChange={e => setEditingSettings({...editingSettings, home: {...editingSettings?.home, heroDesc: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-24 resize-none" placeholder="Description paragraph..." />
                        </div>
                      </div>
                    </div>

                    {/* About */}
                    <div className="bg-[#171717] p-8 border border-white/10 rounded-2xl shadow-sm relative overflow-hidden">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span> About Page Layout</h3>
                      <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Section Eyebrow</label>
                            <input type="text" value={editingSettings?.about?.eyebrow || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, eyebrow: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="e.g. Master Polishers" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Split Headline (Standard / Italic)</label>
                            <div className="flex gap-3">
                              <input type="text" value={editingSettings?.about?.title1 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, title1: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="Obsessive" />
                              <input type="text" value={editingSettings?.about?.title2 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, title2: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="Detailing." />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Paragraph Block 1</label>
                            <textarea value={editingSettings?.about?.p1 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p1: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Paragraph Block 2</label>
                            <textarea value={editingSettings?.about?.p2 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p2: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Paragraph Block 3</label>
                            <textarea value={editingSettings?.about?.p3 || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, p3: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all h-32 resize-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Founder / Shop Image URL</label>
                          <input type="url" value={editingSettings?.about?.image || ''} onChange={e => setEditingSettings({...editingSettings, about: {...editingSettings?.about, image: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="https://..." />
                        </div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-[#171717] p-8 border border-white/10 rounded-2xl shadow-sm relative overflow-hidden">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Global Business Info</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Business Phone</label>
                          <input type="text" value={editingSettings?.contact?.phone || ''} onChange={e => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, phone: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="(555) 555-5555" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Support Email</label>
                          <input type="email" value={editingSettings?.contact?.email || ''} onChange={e => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, email: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="hello@brand.com" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Coverage Area</label>
                          <input type="text" value={editingSettings?.contact?.area || ''} onChange={e => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, area: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="Dallas / Fort Worth" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Operating Hours</label>
                          <input type="text" value={editingSettings?.contact?.hours || ''} onChange={e => setEditingSettings({...editingSettings, contact: {...editingSettings?.contact, hours: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all" placeholder="9 AM - 6 PM" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8">
                     <div className="bg-[#171717] p-8 border border-white/10 rounded-2xl shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">Search Engine Data (Head)</h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Title Tag (Top Browser Bar)</label>
                            <input type="text" value={editingSettings?.seo?.title || ''} onChange={e => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, title: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all font-mono" placeholder="Brand Name | Premium Service" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Meta Description (Search Results Blur)</label>
                            <textarea value={editingSettings?.seo?.description || ''} onChange={e => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, description: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all font-mono h-24 resize-none" placeholder="Description snippet..." />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Keywords List</label>
                            <input type="text" value={editingSettings?.seo?.keywords || ''} onChange={e => setEditingSettings({...editingSettings, seo: {...editingSettings?.seo, keywords: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all font-mono" placeholder="clean, wash, ceramic" />
                          </div>
                        </div>
                     </div>

                     <div className="bg-[#171717] p-8 border border-white/10 rounded-2xl shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">API Integrations</h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-semibold text-[#a1a1aa] mb-2">Google Analytics 4 ID</label>
                            <input type="text" value={editingSettings?.analytics?.gaId || ''} onChange={e => setEditingSettings({...editingSettings, analytics: {...editingSettings?.analytics, gaId: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-white/30 focus:bg-white/5 transition-all font-mono uppercase" placeholder="G-XXXXXXXXXX" />
                            <p className="text-xs text-[#71717a] mt-2">Connects pageviews and lead events directly to your GA dashboard automatically.</p>
                          </div>
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
`;

fs.writeFileSync('src/pages/Admin.tsx', beforeReturn + newRender);
