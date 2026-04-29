import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Users, Building2, Briefcase, AlertCircle } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { students, companies, placements, reminderDays } = useData();
  const navigate = useNavigate();

  const activePlacements = placements.filter(p => p.status === 'active').length;
  const pendingPlacements = placements.filter(p => p.status === 'pending').length;

  const getUpcomingEvents = () => {
    const today = new Date();
    const events: { title: string; days: number; type: 'start' | 'end'; id: string }[] = [];

    placements.forEach(p => {
      if (p.status === 'pending' || p.status === 'active') {
        const startDays = differenceInDays(parseISO(p.startDate), today);
        const endDays = differenceInDays(parseISO(p.endDate), today);

        const student = students.find(s => s.id === p.studentId);
        if (!student) return;

        if (startDays > 0 && startDays <= reminderDays) {
          events.push({ title: `${student.firstName} ${student.lastName} inicia prácticas`, days: startDays, type: 'start', id: p.id + 's' });
        }
        if (endDays > 0 && endDays <= reminderDays) {
          events.push({ title: `${student.firstName} ${student.lastName} finaliza prácticas`, days: endDays, type: 'end', id: p.id + 'e' });
        }
      }
    });

    return events.sort((a, b) => a.days - b.days);
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Dashboard</h2>
        <p className="text-zinc-500 mt-2">Resumen de la gestión de FEs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Alumnos" value={students.length} icon={Users} color="bg-blue-500" onDoubleClick={() => navigate('/students')} />
        <StatCard title="Empresas" value={companies.length} icon={Building2} color="bg-purple-500" onDoubleClick={() => navigate('/companies')} />
        <StatCard title="Prácticas Activas" value={activePlacements} subtitle={`${pendingPlacements} pendientes`} icon={Briefcase} color="bg-emerald-500" onDoubleClick={() => navigate('/placements')} />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="text-lg font-semibold text-zinc-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
            Próximos Eventos ({reminderDays} días)
          </h3>
        </div>
        <div className="divide-y divide-zinc-100">
          {upcomingEvents.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              No hay eventos próximos.
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="p-4 px-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${event.type === 'start' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <p className="font-medium text-zinc-900">{event.title}</p>
                </div>
                <span className="text-sm text-zinc-500 font-medium bg-zinc-100 px-3 py-1 rounded-full">
                  Faltan {event.days} {event.days === 1 ? 'día' : 'días'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, onDoubleClick }: any) => (
  <div 
    onDoubleClick={onDoubleClick}
    className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all select-none"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={120} className={color.replace('bg-', 'text-')} />
    </div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}-500/30 mb-6`}>
        <Icon size={24} />
      </div>
      <h3 className="text-zinc-500 font-medium text-sm">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-zinc-900 tracking-tight">{value}</span>
        {subtitle && <span className="text-sm font-medium text-zinc-400">{subtitle}</span>}
      </div>
    </div>
  </div>
);
