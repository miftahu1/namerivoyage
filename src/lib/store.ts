"use client";

import { useEffect, useState } from 'react';

export interface TripData {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: string;
  departureTime: string;
  returnTime: string;
  organizedBy: string[];
  itinerary: { day: number; title: string; description: string; activities: string[] }[];
  packingList: string[];
  rules: string[];
  emergencyContact: string;
}

export interface Student {
  id: string;
  fullName: string;
  classSection: string;
  phone: string;
  guardianContact: string;
  medicalConditions: string;
  status: 'pending' | 'approved' | 'rejected';
  feesStatus: 'paid' | 'unpaid';
  photoUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
}

const DEFAULT_TRIP: TripData = {
  name: "Class 12 Nameri Trip – Arunodoi Academy",
  location: "Nameri National Park, Assam",
  startDate: "2025-04-15",
  endDate: "2025-04-17",
  duration: "3 Days, 2 Nights",
  departureTime: "07:00 AM, School Main Gate",
  returnTime: "06:00 PM, School Main Gate",
  organizedBy: ["Mr. Das", "Mrs. Baruah", "Mr. Sharma"],
  itinerary: [
    { day: 1, title: "Departure & Arrival", activities: ["Bus Ride", "Tent Assignment", "Evening Bonfire"], description: "Early morning departure from school. Scenic drive to Nameri. Afternoon arrival and camping setup. Evening introduction and bonfire." },
    { day: 2, title: "Jungle Trek & River Rafting", activities: ["Nature Walk", "White Water Rafting", "Bird Watching"], description: "Morning trek through the sanctuary guided by forest officials. Afternoon river rafting in the Jia Bhoroli river. Exceptional bird watching opportunities." },
    { day: 3, title: "Cultural Interaction & Return", activities: ["Local Village Visit", "Reflection Session", "Group Photo"], description: "Visit to a nearby Mishing village. Lunch and reflection session before boarding the bus for return journey." }
  ],
  packingList: ["Trekking Shoes", "Warm Jacket", "Rain Coat", "Water Bottle", "Sunscreen", "Personal Medication", "School ID Card"],
  rules: ["Strict adherence to schedule", "No straying from the group", "Environment conservation (no littering)", "Respect forest guards and locals", "Smartphone usage restricted during activities"],
  emergencyContact: "+91 98765-43210 (Mr. Das)"
};

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', fullName: "Aryan Sharma", classSection: "12A", phone: "9123456780", guardianContact: "9123456781", medicalConditions: "None", status: 'approved', feesStatus: 'paid', createdAt: new Date().toISOString() },
  { id: '2', fullName: "Priya Kalita", classSection: "12B", phone: "9123456782", guardianContact: "9123456783", medicalConditions: "Asthma", status: 'approved', feesStatus: 'unpaid', createdAt: new Date().toISOString() },
  { id: '3', fullName: "Rohan Bora", classSection: "12A", phone: "9123456784", guardianContact: "9123456785", medicalConditions: "None", status: 'pending', feesStatus: 'unpaid', createdAt: new Date().toISOString() }
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', date: "March 20, 2025", title: "Registration Deadline", content: "Last date to register is April 5th. Please ensure medical forms are submitted." },
  { id: '2', date: "March 25, 2025", title: "New Activity Added", content: "We have successfully added an educational visit to the Eco-Camp museum." }
];

export function useNameriStore() {
  const [trip, setTrip] = useState<TripData>(DEFAULT_TRIP);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedTrip = localStorage.getItem('nameri_trip');
    const storedStudents = localStorage.getItem('nameri_students');
    const storedAnnouncements = localStorage.getItem('nameri_announcements');

    if (storedTrip) setTrip(JSON.parse(storedTrip));
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    else setStudents(DEFAULT_STUDENTS);
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    else setAnnouncements(DEFAULT_ANNOUNCEMENTS);

    setIsInitialized(true);
  }, []);

  const saveTrip = (data: TripData) => {
    setTrip(data);
    localStorage.setItem('nameri_trip', JSON.stringify(data));
  };

  const addStudent = (student: Omit<Student, 'id' | 'status' | 'feesStatus' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      feesStatus: 'unpaid',
      createdAt: new Date().toISOString()
    };
    const newStudents = [newStudent, ...students];
    setStudents(newStudents);
    localStorage.setItem('nameri_students', JSON.stringify(newStudents));
    return newStudent;
  };

  const updateStudentStatus = (id: string, status: 'approved' | 'rejected') => {
    const newStudents = students.map(s => s.id === id ? { ...s, status } : s);
    setStudents(newStudents);
    localStorage.setItem('nameri_students', JSON.stringify(newStudents));
  };

  const updateFeesStatus = (id: string, feesStatus: 'paid' | 'unpaid') => {
    const newStudents = students.map(s => s.id === id ? { ...s, feesStatus } : s);
    setStudents(newStudents);
    localStorage.setItem('nameri_students', JSON.stringify(newStudents));
  };

  const deleteStudent = (id: string) => {
    const newStudents = students.filter(s => s.id !== id);
    setStudents(newStudents);
    localStorage.setItem('nameri_students', JSON.stringify(newStudents));
  };

  const addAnnouncement = (title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title,
      content
    };
    const newAnnouncements = [newAnnouncement, ...announcements];
    setAnnouncements(newAnnouncements);
    localStorage.setItem('nameri_announcements', JSON.stringify(newAnnouncements));
  };

  return { 
    trip, students, announcements, isInitialized, 
    saveTrip, addStudent, updateStudentStatus, 
    updateFeesStatus, deleteStudent, addAnnouncement 
  };
}
