
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
  Megaphone, Send, TreeDeciduous, Lock, ChevronRight
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <TreeDeciduous className="w-12 h-12 text-primary animate-bounce" />
      <p className="font-headline font-bold text-primary animate-pulse">Syncing Voyage Data...</p>
    </div>
  );

  const approvedStudents = students.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="font-headline font-bold text-lg text-primary">Nameri Voyage</span>
          </div>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 gap-2" asChild>
            <Link href="/admin"><Lock className="w-3.5 h-3.5" /> Admin</Link>
          </Button>
        </div>
      </header>

      <section className="relative h-[70vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage?.imageUrl || ""} alt="Nameri" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-bold">Class 12 Excursion</Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 tracking-tight text-primary">Nameri Wilds</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium italic">"The last grand adventure before the boards."</p>
          <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-lg shadow-xl" asChild>
            <a href="#register">Join the Voyage</a>
          </Button>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-16 space-y-24">
        {announcements.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Megaphone className="text-primary w-5 h-5" />
              <h2 className="text-2xl font-headline font-bold">Latest Updates</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {announcements.map((ann) => (
                <Card key={ann.id} className="border-l-4 border-l-primary shadow-sm bg-card/50">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-bold">{ann.title}</CardTitle>
                      <span className="text-[10px] text-muted-foreground font-bold">{ann.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">{ann.content}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Voyagers Joining Us</h2>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold">{approvedStudents.length} Confirmed</Badge>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {approvedStudents.map((student) => (
              <div key={student.id} className="bg-white border border-primary/10 px-4 py-2 rounded-full shadow-sm flex items-center gap-3 hover:border-primary/50 transition-colors">
                <span className="font-semibold text-sm">{student.fullName}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{student.classSection}</span>
              </div>
            ))}
            {approvedStudents.length === 0 && <p className="text-muted-foreground italic text-sm">Be the first to join the adventure!</p>}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Trip Logistics</h2>
            <div className="grid gap-4">
              {[
                { icon: MapPin, label: "Dest", val: trip.location },
                { icon: Calendar, label: "Date", val: "March 25, 2026" },
                { icon: Clock, label: "Duration", val: "1 Day (6AM - 8PM)" },
                { icon: Users, label: "Staff", val: trip.organizedBy.join(', ') },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border bg-card/30">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{item.label}</h3>
                    <p className="font-semibold text-sm">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold text-primary">Rules & Safety</h2>
            <ul className="space-y-3">
              {trip.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="register" className="max-w-2xl mx-auto pt-12">
          <Card className="shadow-2xl border-primary/20">
            <div className="h-2 bg-primary" />
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-headline font-bold">Secure Your Spot</CardTitle>
              <CardDescription>Final excursion registration for Class 12</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              {submitted ? (
                <div className="text-center py-8 space-y-4 animate-in zoom-in">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto"><ShieldCheck className="w-8 h-8" /></div>
                  <h3 className="text-xl font-bold">Registration Success!</h3>
                  <p className="text-muted-foreground text-sm">Wait for approval on the "Voyagers" board above.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="rounded-full">New Submission</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs uppercase font-bold text-muted-foreground">Full Name</Label>
                      <Input id="fullName" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleInputChange} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="classSection" className="text-xs uppercase font-bold text-muted-foreground">Class-Sec</Label>
                      <Input id="classSection" name="classSection" placeholder="e.g. 12-A" required value={formData.classSection} onChange={handleInputChange} className="h-10" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs uppercase font-bold text-muted-foreground">Your Phone</Label>
                      <Input id="phone" name="phone" placeholder="Mobile" required type="tel" value={formData.phone} onChange={handleInputChange} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="guardianContact" className="text-xs uppercase font-bold text-muted-foreground">Parent Phone</Label>
                      <Input id="guardianContact" name="guardianContact" placeholder="Emergency" required type="tel" value={formData.guardianContact} onChange={handleInputChange} className="h-10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="medicalConditions" className="text-xs uppercase font-bold text-muted-foreground">Medical Conditions</Label>
                    <Textarea id="medicalConditions" name="medicalConditions" placeholder="None" value={formData.medicalConditions} onChange={handleInputChange} className="min-h-[80px]" />
                  </div>
                  <Button type="submit" className="w-full h-11 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-md" disabled={isSubmitting}>
                    {isSubmitting ? "Syncing..." : "Confirm My Spot"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-muted/30 py-12 border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="text-lg font-bold text-primary">Nameri Voyage</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">&copy; {new Date().getFullYear()} Arunodoi Academy Class 12</p>
        </div>
      </footer>
    </div>
  );
}
