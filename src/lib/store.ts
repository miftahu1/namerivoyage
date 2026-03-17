
"use client";

import { useEffect, useState } from 'react';
import { 
  db 
} from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';

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
  capacity: number;
  feeAmount: string;
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
  createdAt: string;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  timestamp: number;
}

const DEFAULT_TRIP: TripData = {
  name: "Class 12 Nameri Trip – Arunodoi Academy",
  location: "Nameri National Park, Assam",
  startDate: "2026-03-25",
  endDate: "2026-03-25",
  duration: "1 Day",
  departureTime: "06:00 AM, School Main Gate",
  returnTime: "08:00 PM, School Main Gate",
  organizedBy: ["Mr. Das", "Mrs. Baruah", "Mr. Sharma"],
  itinerary: [
    { 
      day: 1, 
      title: "Nature & Adventure Day", 
      activities: ["Jungle Trek", "River Rafting", "Wildlife Observation"], 
      description: "A high-intensity day starting with an early morning jungle trek through the sanctuary." 
    }
  ],
  packingList: ["Comfortable Shoes", "Water Bottle", "Sunscreen", "Personal Medication", "School ID Card"],
  rules: ["Strict adherence to schedule", "No straying from the group", "Environment conservation"],
  emergencyContact: "+91 98765-43210 (Mr. Das)",
  capacity: 40,
  feeAmount: "₹1,500"
};

export function useNameriStore() {
  const [trip, setTrip] = useState<TripData>(DEFAULT_TRIP);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Sync Trip Settings
    const tripDocRef = doc(db, 'settings', 'trip');
    
    // Check if doc exists initially to seed it if missing
    getDoc(tripDocRef).then((docSnap) => {
      if (!docSnap.exists()) {
        setDoc(tripDocRef, DEFAULT_TRIP);
      }
    }).catch(console.error);

    const unsubTrip = onSnapshot(tripDocRef, (doc) => {
      if (doc.exists()) {
        setTrip(doc.data() as TripData);
      }
      setIsInitialized(true);
    }, (error) => {
      console.error("Trip sync error:", error);
      setIsInitialized(true);
    });

    // Sync Students
    const studentsRef = collection(db, 'students');
    const qStudents = query(studentsRef, orderBy('createdAt', 'desc'));
    const unsubStudents = onSnapshot(qStudents, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(data);
    }, (error) => console.error("Students sync error:", error));

    // Sync Announcements
    const announcementsRef = collection(db, 'announcements');
    const qAnnouncements = query(announcementsRef, orderBy('timestamp', 'desc'));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
      setAnnouncements(data);
    }, (error) => console.error("Announcements sync error:", error));

    return () => {
      unsubTrip();
      unsubStudents();
      unsubAnnouncements();
    };
  }, []);

  const saveTrip = async (data: TripData) => {
    const tripDocRef = doc(db, 'settings', 'trip');
    try {
      await setDoc(tripDocRef, data);
    } catch (error) {
      console.error("Error saving trip:", error);
      throw error;
    }
  };

  const addStudent = async (student: Omit<Student, 'id' | 'status' | 'feesStatus' | 'createdAt'>) => {
    const studentsRef = collection(db, 'students');
    try {
      return await addDoc(studentsRef, {
        ...student,
        status: 'pending',
        feesStatus: 'unpaid',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  };

  const updateStudentStatus = async (id: string, status: 'approved' | 'rejected') => {
    const studentRef = doc(db, 'students', id);
    try {
      await updateDoc(studentRef, { status });
    } catch (error) {
      console.error("Error updating student status:", error);
      throw error;
    }
  };

  const updateFeesStatus = async (id: string, feesStatus: 'paid' | 'unpaid') => {
    const studentRef = doc(db, 'students', id);
    try {
      await updateDoc(studentRef, { feesStatus });
    } catch (error) {
      console.error("Error updating fees status:", error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    const studentRef = doc(db, 'students', id);
    try {
      await deleteDoc(studentRef);
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  const addAnnouncement = async (title: string, content: string) => {
    const announcementsRef = collection(db, 'announcements');
    try {
      await addDoc(announcementsRef, {
        title,
        content,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      });
    } catch (error) {
      console.error("Error adding announcement:", error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const announcementRef = doc(db, 'announcements', id);
    try {
      await deleteDoc(announcementRef);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  };

  return { 
    trip, students, announcements, isInitialized, 
    saveTrip, addStudent, updateStudentStatus, 
    updateFeesStatus, deleteStudent, addAnnouncement, deleteAnnouncement
  };
}
