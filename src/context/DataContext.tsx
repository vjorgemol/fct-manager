import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Student, Company, Placement, Teacher } from '../types';

const API_URL = 'http://localhost:3005/api';

interface DataContextType {
  students: Student[];
  companies: Company[];
  placements: Placement[];
  teachers: Teacher[];
  schoolName: string;
  setSchoolName: (name: string) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  reminderDays: number;
  setReminderDays: (days: number) => void;
  tutorName: string;
  setTutorName: (name: string) => void;
  tutorEmail: string;
  setTutorEmail: (email: string) => void;
  cycleName: string;
  setCycleName: (name: string) => void;
  allStudents: Student[];
  allPlacements: Placement[];
  importData: (data: { students: Student[], companies: Company[], placements: Placement[], teachers?: Teacher[], schoolName: string, academicYear: string, reminderDays?: number, tutorName?: string, tutorEmail?: string, cycleName?: string }) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  deleteTeacher: (id: string) => void;
  addPlacement: (placement: Omit<Placement, 'id'>) => void;
  updatePlacement: (placement: Placement) => void;
  deletePlacement: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [academicYear, setAcademicYear] = useState<string>('25/26');
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolName, setSchoolName] = useState<string>('Centro Educativo');
  const [reminderDays, setReminderDays] = useState<number>(14);
  const [tutorName, setTutorName] = useState<string>('Tutor FCT');
  const [tutorEmail, setTutorEmail] = useState<string>('tutor@centro.edu');
  const [cycleName, setCycleName] = useState<string>('Formación Profesional');

  useEffect(() => {
    // Load initial data from server
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.academicYear) setAcademicYear(data.academicYear);
        if (data.reminderDays) setReminderDays(Number(data.reminderDays));
        if (data.tutorName) setTutorName(data.tutorName);
        if (data.tutorEmail) setTutorEmail(data.tutorEmail);
        if (data.cycleName) setCycleName(data.cycleName);
      })
      .catch(console.error);

    fetch(`${API_URL}/students`).then(res => res.json()).then(setStudents).catch(console.error);
    fetch(`${API_URL}/companies`).then(res => res.json()).then(setCompanies).catch(console.error);
    fetch(`${API_URL}/placements`).then(res => res.json()).then(setPlacements).catch(console.error);
    fetch(`${API_URL}/teachers`).then(res => res.json()).then(setTeachers).catch(console.error);
  }, []);

  const updateSettings = (key: string, value: string) => {
    fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).catch(console.error);
  };

  const handleSetSchoolName = (name: string) => {
    setSchoolName(name);
    updateSettings('schoolName', name);
  };

  const handleSetAcademicYear = (year: string) => {
    setAcademicYear(year);
    updateSettings('academicYear', year);
  };

  const handleSetReminderDays = (days: number) => {
    setReminderDays(days);
    updateSettings('reminderDays', days.toString());
  };

  const handleSetTutorName = (name: string) => {
    setTutorName(name);
    updateSettings('tutorName', name);
  };

  const handleSetTutorEmail = (email: string) => {
    setTutorEmail(email);
    updateSettings('tutorEmail', email);
  };

  const handleSetCycleName = (name: string) => {
    setCycleName(name);
    updateSettings('cycleName', name);
  };

  const getPreviousYear = (year: string) => {
    if (!year || !year.includes('/')) return year;
    const parts = year.split('/');
    const prev1 = parseInt(parts[0], 10) - 1;
    const prev2 = parseInt(parts[1], 10) - 1;
    return `${prev1}/${prev2}`;
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: crypto.randomUUID(), academicYear };
    setStudents(prev => [...prev, newStudent]);
    fetch(`${API_URL}/students`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newStudent) }).catch(console.error);
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    fetch(`${API_URL}/students/${updated.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }).catch(console.error);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setPlacements(prev => prev.filter(p => p.studentId !== id));
    fetch(`${API_URL}/students/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = { ...company, id: crypto.randomUUID() };
    setCompanies(prev => [...prev, newCompany]);
    fetch(`${API_URL}/companies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCompany) }).catch(console.error);
  };

  const updateCompany = (updated: Company) => {
    setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    fetch(`${API_URL}/companies/${updated.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }).catch(console.error);
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    setPlacements(prev => prev.filter(p => p.companyId !== id));
    fetch(`${API_URL}/companies/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: crypto.randomUUID() };
    setTeachers(prev => [...prev, newTeacher]);
    fetch(`${API_URL}/teachers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTeacher) }).catch(console.error);
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    setPlacements(prev => prev.map(p => p.teacherId === id ? { ...p, teacherId: undefined } : p));
    fetch(`${API_URL}/teachers/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const addPlacement = (placement: Omit<Placement, 'id'>) => {
    const newPlacement = { ...placement, id: crypto.randomUUID(), academicYear };
    setPlacements(prev => [...prev, newPlacement]);
    fetch(`${API_URL}/placements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPlacement) }).catch(console.error);
  };

  const updatePlacement = (updated: Placement) => {
    setPlacements(prev => prev.map(p => p.id === updated.id ? updated : p));
    fetch(`${API_URL}/placements/${updated.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }).catch(console.error);
  };

  const deletePlacement = (id: string) => {
    setPlacements(prev => prev.filter(p => p.id !== id));
    fetch(`${API_URL}/placements/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const filteredStudents = students.filter(s => 
    s.academicYear === academicYear || s.academicYear === getPreviousYear(academicYear)
  );
  const filteredPlacements = placements.filter(p => p.academicYear === academicYear);

  const importData = (data: { students: Student[], companies: Company[], placements: Placement[], teachers?: Teacher[], schoolName: string, academicYear: string, reminderDays?: number, tutorName?: string, tutorEmail?: string, cycleName?: string }) => {
    setStudents(data.students || []);
    setCompanies(data.companies || []);
    setPlacements(data.placements || []);
    setTeachers(data.teachers || []);
    setSchoolName(data.schoolName || 'Centro Educativo');
    setAcademicYear(data.academicYear || '25/26');
    if (data.reminderDays) setReminderDays(data.reminderDays);
    if (data.tutorName) setTutorName(data.tutorName);
    if (data.tutorEmail) setTutorEmail(data.tutorEmail);
    if (data.cycleName) setCycleName(data.cycleName);
    
    fetch(`${API_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  };

  return (
    <DataContext.Provider value={{
      students: filteredStudents, 
      allStudents: students,
      companies, 
      placements: filteredPlacements, 
      allPlacements: placements,
      teachers,
      schoolName, setSchoolName: handleSetSchoolName,
      academicYear, setAcademicYear: handleSetAcademicYear,
      reminderDays, setReminderDays: handleSetReminderDays,
      tutorName, setTutorName: handleSetTutorName,
      tutorEmail, setTutorEmail: handleSetTutorEmail,
      cycleName, setCycleName: handleSetCycleName,
      importData,
      addStudent, updateStudent, deleteStudent,
      addCompany, updateCompany, deleteCompany,
      addTeacher, deleteTeacher,
      addPlacement, updatePlacement, deletePlacement
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
