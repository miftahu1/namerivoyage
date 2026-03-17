
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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, MapPin, Clock, Users, ShieldCheck, 
  Megaphone, TreeDeciduous, Lock, Info
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
    if (!formData.fullName || !formData.classSection || !formData.phone || !formData.guardianContact) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all required fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      await addStudent(formData);
      setSubmitted(true);
      toast({ title: "Registration Successful!", description: "Waiting for teacher approval." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <TreeDeciduous className="w-12 h-12 text-primary animate-bounce mb-4" />
      <p className="text-sm font-bold text-primary animate-pulse tracking-widest uppercase">Preparing Voyage...</p>
    </div>
  );

  const approvedStudents = students.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b h-16 flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="font-bold text-primary tracking-tight">Nameri Voyage</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary gap-1.5" asChild>
            <Link href="/admin"><Lock className="w-4 h-4" /> <span className="hidden sm:inline">Admin Portal</span></Link>
          </Button>
        </div>
      </header>

      <section className="relative min-h-[50vh] flex items-center justify-center pt-16 px-4">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage?.imageUrl || ""} 
            alt="Nameri National Park" 
            fill 
            className="object-cover opacity-15 grayscale-[20%]" 
            priority 
            data-ai-hint="nature mountains forest"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 font-bold uppercase tracking-widest py-1 px-4">
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary tracking-tighter leading-[1.1]">The Wild Call</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">Arunodoi Academy's Class 12 expedition to the heart of Nameri. One day of nature, adventure, and bonding.</p>
          <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-primary hover:bg-primary/90 shadow-xl transition-transform hover:scale-105" asChild>
            <a href="#register">Claim Your Spot</a>
          </Button>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        {announcements.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full"><Megaphone className="text-primary w-5 h-5" /></div>
              <h2 className="text-2xl font-bold tracking-tight">Latest Broadcasts</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {announcements.map((ann) => (
                <Card key={ann.id} className="border-none shadow-md bg-white hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-1 bg-primary w-full" />
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-base font-bold flex justify-between items-center gap-4">
                      {ann.title}
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase bg-muted px-2 py-0.5 rounded-full shrink-0">{ann.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed">{ann.content}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full"><Users className="text-primary w-5 h-5" /></div>
              <h2 className="text-2xl font-bold tracking-tight">Voyagers Board</h2>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold px-3 py-1">
              {approvedStudents.length} {approvedStudents.length === 1 ? 'Student' : 'Students'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            {approvedStudents.map((student) => (
              <div key={student.id} className="bg-white border px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm hover:border-primary/30 transition-colors">
                {student.fullName} <span className="opacity-50 text-[11px] bg-muted px-2 py-0.5 rounded-full font-bold">{student.classSection}</span>
              </div>
            ))}
            {approvedStudents.length === 0 && (
              <div className="w-full py-12 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                <p className="text-muted-foreground font-medium">Be the first to join the adventure!</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Voyage Brief</h2>
              <p className="text-muted-foreground leading-relaxed">Everything you need to know for our upcoming Class 12 excursion to Nameri National Park. Please review the schedule and departure details carefully.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Destinations", val: trip.location },
                { icon: Clock, label: "Muster Time", val: trip.departureTime },
                { icon: Users, label: "Expedition Leads", val: trip.organizedBy.join(', ') },
                { icon: Calendar, label: "Window", val: trip.duration },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-6 rounded-3xl border bg-white/60 shadow-sm backdrop-blur-sm">
                  <div className="bg-primary/10 w-10 h-10 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-foreground leading-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="register" className="scroll-mt-24">
            <Card className="shadow-2xl border-primary/10 overflow-hidden rounded-3xl bg-white">
              <div className="h-3 bg-primary" />
              <CardHeader className="text-center p-8 pb-4">
                <CardTitle className="text-2xl font-bold tracking-tight">Student Enrollment</CardTitle>
                <CardDescription className="text-base">Register your participation for the excursion</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                {submitted ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">Registration Received!</p>
                      <p className="text-muted-foreground max-w-[280px] mx-auto">Your details are being reviewed. Please wait for official approval from your class teacher.</p>
                    </div>
                    <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full rounded-2xl h-12">Submit Another Request</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Full Legal Name</Label>
                      <Input id="fullName" name="fullName" placeholder="Student's name as per records" required value={formData.fullName} onChange={handleInputChange} className="h-12 rounded-2xl border-muted-foreground/20 focus:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classSection" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Class & Section</Label>
                      <Input id="classSection" name="classSection" placeholder="e.g. 12 Sci-A" required value={formData.classSection} onChange={handleInputChange} className="h-12 rounded-2xl border-muted-foreground/20" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Personal Contact</Label>
                        <Input id="phone" name="phone" placeholder="10-digit number" required type="tel" value={formData.phone} onChange={handleInputChange} className="h-12 rounded-2xl border-muted-foreground/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardianContact" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Emergency Contact</Label>
                        <Input id="guardianContact" name="guardianContact" placeholder="Guardian's number" required type="tel" value={formData.guardianContact} onChange={handleInputChange} className="h-12 rounded-2xl border-muted-foreground/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="medicalConditions" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Medical Notes (Optional)</Label>
                        <Badge variant="ghost" className="text-[9px] opacity-60"><Info className="w-3 h-3 mr-1" /> Confidential</Badge>
                      </div>
                      <Textarea id="medicalConditions" name="medicalConditions" placeholder="Allergies, conditions, or regular meds..." value={formData.medicalConditions} onChange={handleInputChange} className="min-h-[100px] rounded-2xl border-muted-foreground/20 resize-none" />
                    </div>
                    <Button type="submit" className="w-full h-14 font-bold text-lg bg-primary hover:bg-primary/90 rounded-2xl shadow-lg mt-4 transition-all" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm Participation"}
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground leading-relaxed px-4">By submitting, you confirm all details are accurate and you agree to abide by school excursion safety protocols.</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="font-black text-lg tracking-widest uppercase text-primary">Nameri Voyage 2026</span>
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-[0.2em] leading-loose">&copy; 2026 Arunodoi Academy | All Rights Reserved<br/>Educational Excursion Class 12</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
