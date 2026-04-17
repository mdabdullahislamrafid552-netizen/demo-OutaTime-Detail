import fs from 'fs';

const content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

const returnStatement = "    return () => {\\n" +
"      unsubServices();\\n" +
"      unsubGallery();\\n" +
"      unsubLeads();\\n" +
"      unsubSettings();\\n" +
"    };\\n" +
"  }, []);\\n" +
"\\n" +
"  const showToast = (message: string, type: 'success' | 'error' = 'success') => {\\n" +
"    setToast({ message, type });\\n" +
"    setTimeout(() => setToast(null), 3000);\\n" +
"  };\\n" +
"\\n" +
"  const handleAddImage = async (e: React.FormEvent) => {\\n" +
"    e.preventDefault();\\n" +
"    if (!newImgUrl || previewError) return;\\n" +
"    setIsSaving(true);\\n" +
"    await addGalleryImage(newImgUrl, 'Gallery Upload');\\n" +
"    setNewImgUrl('');\\n" +
"    setIsSaving(false);\\n" +
"    showToast('Image published to gallery');\\n" +
"  };\\n" +
"\\n" +
"  const confirmDelete = async () => {\\n" +
"    if (!deleteConfirm) return;\\n" +
"    setIsSaving(true);\\n" +
"    try {\\n" +
"      if (deleteConfirm.type === 'gallery') {\\n" +
"        await deleteGalleryImage(deleteConfirm.id);\\n" +
"      } else if (deleteConfirm.type === 'service') {\\n" +
"        await deleteService(deleteConfirm.id);\\n" +
"        setEditingService(null);\\n" +
"      } else if (deleteConfirm.type === 'lead') {\\n" +
"        await deleteLead(deleteConfirm.id);\\n" +
"      }\\n" +
"      showToast(deleteConfirm.type + ' deleted');\\n" +
"    } catch {\\n" +
"      showToast('Failed to delete item', 'error');\\n" +
"    }\\n" +
"    setIsSaving(false);\\n" +
"    setDeleteConfirm(null);\\n" +
"  };\\n" +
"\\n" +
"  const handleSaveService = async (e: React.FormEvent) => {\\n" +
"    e.preventDefault();\\n" +
"    setIsSaving(true);\\n" +
"    try {\\n" +
"      await saveService(editingService.id || null, editingService);\\n" +
"      setEditingService(null);\\n" +
"      showToast('Service package updated');\\n" +
"    } catch {\\n" +
"      showToast('Failed to save service', 'error');\\n" +
"    }\\n" +
"    setIsSaving(false);\\n" +
"  };\\n" +
"\\n" +
"  const handleCreateNewService = () => {\\n" +
"    setEditingService({ title: '', desc: '', description: '', img: '', features: [''], price: '' });\\n" +
"  };\\n" +
"\\n" +
"  const handleEditService = (service: any) => {\\n" +
"      setEditingService({...service, features: service.features || []});\\n" +
"  };\\n" +
"\\n" +
"  return (\\n";

const targetString = '    return (\\n    <div className="min-h-screen -mt-24 pt-32 pb-24 px-4 md:px-8 w-full bg-[#0a0a0a] text-[#d1d1d1] font-sans">';

const idx = content.indexOf('    return (');
if (idx !== -1) {
   const before = content.slice(0, idx);
   const after = content.slice(idx + 13);
   const newContent = before + returnStatement + '    <div' + after.slice(after.indexOf('className=') - 1); 
   fs.writeFileSync('src/pages/Admin.tsx', newContent);
   console.log("Patched Admin.tsx");
} else {
   console.log("Could not find insertion point.");
}
