import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Trash2, MapPin, Edit, Search, Phone, Download } from 'lucide-react';

export const Companies: React.FC = () => {
  const { companies, addCompany, deleteCompany, updateCompany, academicYear } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', location: '', address: '', contactPerson: '', collaborationStatus: 'none' as 'none' | 'prospecting' | 'accepted' | 'rejected', inactiveEmail: false, phone: '' });
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const company = companies.find(c => c.id === editingId);
      let pYears = company?.prospectingYears ? company.prospectingYears.split(',').filter(Boolean) : [];
      let aYears = company?.acceptedYears ? company.acceptedYears.split(',').filter(Boolean) : [];
      let rYears = company?.rejectedYears ? company.rejectedYears.split(',').filter(Boolean) : [];
      
      // Remove current year from all lists first
      pYears = pYears.filter(y => y !== academicYear);
      aYears = aYears.filter(y => y !== academicYear);
      rYears = rYears.filter(y => y !== academicYear);
      
      // Add to the selected status list
      if (formData.collaborationStatus === 'prospecting') pYears.push(academicYear);
      if (formData.collaborationStatus === 'accepted') aYears.push(academicYear);
      if (formData.collaborationStatus === 'rejected') rYears.push(academicYear);
      
      updateCompany({ 
        ...formData, 
        id: editingId, 
        prospectingYears: pYears.join(','),
        acceptedYears: aYears.join(','),
        rejectedYears: rYears.join(',')
      } as any);
    } else {
      const pYears = formData.collaborationStatus === 'prospecting' ? academicYear : '';
      const aYears = formData.collaborationStatus === 'accepted' ? academicYear : '';
      const rYears = formData.collaborationStatus === 'rejected' ? academicYear : '';
      
      addCompany({ 
        ...formData, 
        prospectingYears: pYears,
        acceptedYears: aYears,
        rejectedYears: rYears
      } as any);
    }
    resetForm();
  };

  const handleEdit = (company: any) => {
    let status: 'none' | 'prospecting' | 'accepted' | 'rejected' = 'none';
    if (company.acceptedYears?.includes(academicYear)) status = 'accepted';
    else if (company.rejectedYears?.includes(academicYear)) status = 'rejected';
    else if (company.prospectingYears?.includes(academicYear)) status = 'prospecting';

    setFormData({ 
      name: company.name, 
      email: company.email, 
      location: company.location, 
      address: company.address || '', 
      contactPerson: company.contactPerson || '', 
      collaborationStatus: status, 
      inactiveEmail: !!company.inactiveEmail,
      phone: company.phone || ''
    });
    setEditingId(company.id);
    setIsAdding(true);
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', location: '', address: '', contactPerson: '', collaborationStatus: 'none', inactiveEmail: false, phone: '' });
    setEditingId(null);
    setIsAdding(false);
  };
  const exportToCSV = () => {
    if (companies.length === 0) return;
    const headers = ['Nombre', 'Email', 'Teléfono', 'Localidad', 'Dirección', 'Persona de Contacto', 'Email Inactivo', 'Estado'];
    const rows = companies.map(c => {
      let status = 'Sin contactar';
      if (c.acceptedYears?.includes(academicYear)) status = 'Colabora';
      else if (c.rejectedYears?.includes(academicYear)) status = 'No colabora';
      else if (c.prospectingYears?.includes(academicYear)) status = 'Prospección';

      return [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        `"${c.location}"`,
        `"${c.address || ''}"`,
        `"${c.contactPerson || ''}"`,
        c.inactiveEmail ? 'SÍ' : 'NO',
        `"${status}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `empresas_fct_${academicYear.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = companies.filter(c => 
    `${c.name} ${c.location} ${c.address || ''} ${c.email} ${c.contactPerson || ''} ${c.phone || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Empresas</h2>
            <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">{companies.length}</span>
          </div>
          <p className="text-zinc-500 mt-2">Directorio de empresas colaboradoras.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm"
          >
            <Download size={20} className="sm:mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button 
            onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
              document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 sm:px-5 sm:py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm shadow-primary-500/20"
        >
          <Plus size={20} className="sm:mr-2" />
          <span className="hidden sm:inline">{isAdding ? 'Cancelar' : 'Añadir Empresa'}</span>
        </button>
      </div>
    </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">{editingId ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Comercial</label>
              <input required type="text" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email de Contacto</label>
              <input required type="email" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Localidad</label>
              <input required type="text" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Dirección Completa</label>
              <input type="text" placeholder="Calle, número, código postal..." className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Persona de Contacto</label>
              <input type="text" placeholder="Opcional" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
              <input type="tel" placeholder="Opcional" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Estado de Colaboración ({academicYear})</label>
              <select 
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={formData.collaborationStatus}
                onChange={e => setFormData({...formData, collaborationStatus: e.target.value as any})}
              >
                <option value="none">Sin contactar</option>
                <option value="prospecting">Prospección enviada</option>
                <option value="accepted">Acepta la colaboración</option>
                <option value="rejected">No acepta colaboración</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors mt-6">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 bg-white"
                  checked={formData.inactiveEmail}
                  onChange={e => setFormData({...formData, inactiveEmail: e.target.checked})}
                />
                <span className="text-sm font-medium text-red-700">Email Inactivo</span>
              </label>
            </div>
            <div className="md:col-span-3 flex justify-end mt-4 pt-4 border-t border-zinc-100">
              <button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-100 flex items-center bg-zinc-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar empresa por nombre, localidad, contacto..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-white rounded-2xl border border-dashed border-zinc-200">
            No se encontraron empresas.
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 group hover:shadow-md transition-all relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
                    {c.name.substring(0, 1)}
                  </div>
                  {c.acceptedYears?.includes(academicYear) && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      Colabora
                    </span>
                  )}
                  {c.rejectedYears?.includes(academicYear) && (
                    <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      No colabora
                    </span>
                  )}
                  {c.prospectingYears?.includes(academicYear) && !c.acceptedYears?.includes(academicYear) && !c.rejectedYears?.includes(academicYear) && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      Prospección
                    </span>
                  )}
                  {!!c.inactiveEmail && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      Email Inactivo
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(c)} className="text-zinc-400 hover:text-primary-500 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => setDeletingId(c.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">{c.name}</h3>
              {c.contactPerson && <p className="text-sm font-medium text-zinc-700 mb-1">Att: {c.contactPerson}</p>}
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-sm text-zinc-500">{c.email}</p>
                {c.phone && (
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <Phone size={14} className="text-zinc-400" />
                    <a href={`tel:${c.phone}`} className="text-primary-600 hover:underline font-medium">{c.phone}</a>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-xs font-medium text-zinc-600 bg-zinc-50 inline-flex px-3 py-1.5 rounded-lg w-fit">
                  <MapPin size={14} className="mr-1.5 text-zinc-400 shrink-0" />
                  {c.location}
                </div>
                {(c.address || c.location) && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name} ${c.address ? `${c.address}, ${c.location}` : c.location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center ml-1"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {deletingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setDeletingId(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Eliminar empresa</h3>
            </div>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer y <strong>eliminará también todas las prácticas asociadas</strong> a esta empresa.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeletingId(null)} className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
                Cancelar
              </button>
              <button onClick={() => { deleteCompany(deletingId); setDeletingId(null); }} className="px-5 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors flex items-center">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
