
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useNameriStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, MapPin, Clock, Users, ShieldCheck, 
  Megaphone, TreeDeciduous, Lock, ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const { trip, students, announcements, isInitialized, addStudent } = useNameriStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    classSection: '',
    phone: '',
    guardianContact: '',
    medicalConditions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addStudent(formData);
      setSubmitted(true);
      toast({ title: "Registration Successful!", description: "Pending teacher approval." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <TreeDeciduous className="w-10 h-10 text-primary animate-bounce mb-2" />
      <p className="text-sm font-bold text-primary animate-pulse">Entering Nameri...</p>
    </div>
  );

  const approvedStudents = students.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b h-16 flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-5 h-5" />
            <span className="font-bold text-primary">Nameri Voyage</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary gap-1.5" asChild>
            <Link href="/admin"><Lock className="w-3.5 h-3.5" /> Portal</Link>
          </Button>
        </div>
      </header>

      <section className="relative h-[60vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage?.imageUrl || ""} alt="Nameri" fill className="object-cover opacity-10" priority />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 text-center px-4">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 font-bold">MARCH 25, 2026</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">Wild Nameri</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">Class 12 Educational Excursion to Nameri National Park.</p>
          <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90" asChild>
            <a href="#register">Register Now</a>
          </Button>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {announcements.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="text-primary w-5 h-5" />
              <h2 className="text-xl font-bold">Latest Updates</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {announcements.map((ann) => (
                <Card key={ann.id} className="border-l-4 border-l-primary bg-card/50">
                  <CardHeader className="p-4 pb-1">
                    <CardTitle className="text-sm font-bold flex justify-between items-center">
                      {ann.title}
                      <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground">{ann.content}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Voyagers Board</h2>
            <Badge variant="outline" className="text-primary border-primary/30">{approvedStudents.length} Ready</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {approvedStudents.map((student) => (
              <div key={student.id} className="bg-white border px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm">
                {student.fullName} <span className="opacity-50 text-[10px]">{student.classSection}</span>
              </div>
            ))}
            {approvedStudents.length === 0 && <p className="text-muted-foreground italic text-xs">Waiting for first registration...</p>}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Essentials</h2>
            <div className="grid gap-3">
              {[
                { icon: MapPin, val: trip.location },
                { icon: Clock, val: trip.departureTime },
                { icon: Users, val: trip.organizedBy.join(', ') },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card/30">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="register">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">Registration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-4 space-y-3">
                    <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
                    <p className="text-sm font-bold">Request Sent!</p>
                    <p className="text-xs text-muted-foreground">Wait for teacher approval.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleInputChange} className="h-9" />
                    <Input name="classSection" placeholder="Class-Sec (e.g. 12-A)" required value={formData.classSection} onChange={handleInputChange} className="h-9" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input name="phone" placeholder="Your Phone" required type="tel" value={formData.phone} onChange={handleInputChange} className="h-9" />
                      <Input name="guardianContact" placeholder="Parent Phone" required type="tel" value={formData.guardianContact} onChange={handleInputChange} className="h-9" />
                    </div>
                    <Button type="submit" className="w-full h-10 font-bold" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Confirm Join"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">&copy; 2026 Arunodoi Academy Class 12</p>
      </footer>
    </div>
  );
}
