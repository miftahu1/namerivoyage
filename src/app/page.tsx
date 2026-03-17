
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
          <Image 
            src={heroImage?.imageUrl || ""} 
            alt="Nameri" 
            fill 
            className="object-cover opacity-10" 
            priority 
            data-ai-hint="nature mountains"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 text-center px-4">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 font-bold uppercase tracking-wider">
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary tracking-tight">Wild Nameri</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">Class 12 Educational Excursion to Nameri National Park. Experience nature, adventure, and bonding.</p>
          <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg" asChild>
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
                <Card key={ann.id} className="border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
                  <CardHeader className="p-4 pb-1">
                    <CardTitle className="text-sm font-bold flex justify-between items-center">
                      {ann.title}
                      <span className="text-[10px] text-muted-foreground font-normal">{ann.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">{ann.content}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Voyagers Board</h2>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold">{approvedStudents.length} Ready</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {approvedStudents.map((student) => (
              <div key={student.id} className="bg-white border px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow border-primary/10">
                {student.fullName} <span className="opacity-40 text-[10px] bg-muted px-1.5 py-0.5 rounded">{student.classSection}</span>
              </div>
            ))}
            {approvedStudents.length === 0 && <p className="text-muted-foreground italic text-xs">Waiting for the first registration...</p>}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Voyage Essentials</h2>
            <div className="grid gap-4">
              {[
                { icon: MapPin, label: "Location", val: trip.location },
                { icon: Clock, label: "Departure", val: trip.departureTime },
                { icon: Users, label: "Organized By", val: trip.organizedBy.join(', ') },
                { icon: Calendar, label: "Duration", val: trip.duration },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border bg-white/50 shadow-sm">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                    <p className="text-sm font-medium">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="register" className="scroll-mt-24">
            <Card className="shadow-2xl border-primary/20 overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold">Join the Voyage</CardTitle>
                <CardDescription>Fill in your details to secure your spot</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">Request Sent!</p>
                      <p className="text-sm text-muted-foreground">Please wait for teacher approval. We'll verify your details soon.</p>
                    </div>
                    <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full">Register Another Student</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs font-bold uppercase text-muted-foreground">Full Name</Label>
                      <Input id="fullName" name="fullName" placeholder="As per school records" required value={formData.fullName} onChange={handleInputChange} className="h-10" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="classSection" className="text-xs font-bold uppercase text-muted-foreground">Class & Section</Label>
                      <Input id="classSection" name="classSection" placeholder="e.g. 12-A" required value={formData.classSection} onChange={handleInputChange} className="h-10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase text-muted-foreground">Your Phone</Label>
                        <Input id="phone" name="phone" placeholder="10-digit" required type="tel" value={formData.phone} onChange={handleInputChange} className="h-10" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="guardianContact" className="text-xs font-bold uppercase text-muted-foreground">Guardian Phone</Label>
                        <Input id="guardianContact" name="guardianContact" placeholder="Emergency" required type="tel" value={formData.guardianContact} onChange={handleInputChange} className="h-10" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 font-bold text-lg bg-primary hover:bg-primary/90 mt-2" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm My Spot"}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">By registering, you agree to follow all trip safety guidelines and school rules.</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TreeDeciduous className="text-primary w-4 h-4" />
            <span className="font-bold text-sm tracking-widest uppercase">Nameri Voyage 2026</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">&copy; 2026 Arunodoi Academy | Class 12 Educational Excursion</p>
        </div>
      </footer>
    </div>
  );
}
