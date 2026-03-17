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
  AlertCircle, Megaphone, Send, TreeDeciduous, 
  Waves, ChevronRight, Phone, Download, Lock
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addStudent(formData);
    setIsSubmitting(false);
    setSubmitted(true);
    toast({
      title: "Registration Successful!",
      description: "Your registration has been submitted and is pending approval.",
    });
  };

  if (!isInitialized) return <div className="min-h-screen flex items-center justify-center bg-background">Loading Nameri Voyage...</div>;

  const countdownDays = Math.max(0, Math.ceil((new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="font-headline font-bold text-lg text-primary tracking-tight">Nameri Voyage</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <a href="#itinerary">Itinerary</a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <a href="#register">Register</a>
            </Button>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 gap-2" asChild>
              <Link href="/admin">
                <Lock className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage?.imageUrl || ""} 
            alt="Nameri Landscape" 
            fill 
            className="object-cover opacity-30 scale-105"
            priority
            data-ai-hint="nature forest"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm font-medium tracking-wide uppercase bg-primary/20 text-primary border-primary/30">
            {trip.organizedBy[0]} Presents
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 tracking-tight text-primary">
            One Last Trip – Nameri
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Class 12 • Arunodoi Academy
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-lg shadow-lg" asChild>
              <a href="#register">Register Now</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/5 text-lg" asChild>
              <a href="#itinerary">View Itinerary</a>
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8">
            <div className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-primary/10 shadow-sm">
              <span className="block text-4xl font-bold text-primary">{countdownDays}</span>
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Days to go</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        {/* Announcements */}
        {announcements.length > 0 && (
          <section id="announcements" className="animate-in fade-in duration-700 scroll-mt-24">
            <div className="flex items-center gap-2 mb-8">
              <Megaphone className="text-primary w-6 h-6" />
              <h2 className="text-3xl font-headline font-bold">Latest Updates</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((ann) => (
                <Card key={ann.id} className="border-l-4 border-l-primary nature-card-hover shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{ann.title}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">{ann.date}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{ann.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Participants (Voyagers Joining Us) */}
        <section id="participants" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-bold">Voyagers Joining Us</h2>
            <Badge variant="outline" className="text-lg px-4 py-1 text-primary border-primary/30">
              {students.filter(s => s.status === 'approved').length} Students
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {students.filter(s => s.status === 'approved').map((student) => (
              <div key={student.id} className="bg-white border border-primary/10 px-4 py-2 rounded-full shadow-sm nature-card-hover flex items-center gap-3">
                <span className="font-semibold text-sm whitespace-nowrap">{student.fullName}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                  {student.classSection}
                </span>
              </div>
            ))}
            {students.filter(s => s.status === 'approved').length === 0 && (
              <p className="text-muted-foreground italic">Be the first to join the adventure!</p>
            )}
          </div>
        </section>

        {/* Trip Details */}
        <section id="details" className="grid lg:grid-cols-3 gap-8 scroll-mt-24">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold text-primary">Experience the Wild</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nameri National Park, nestled in the foothills of the eastern Himalayas, is our destination for the final school excursion. A place of pristine beauty, dense forests, and the sparkling Jia Bhoroli river.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, label: "Location", val: trip.location },
                { icon: Calendar, label: "Date", val: `${new Date(trip.startDate).toLocaleDateString()}` },
                { icon: Clock, label: "Duration", val: trip.duration },
                { icon: Send, label: "Departure", val: trip.departureTime },
                { icon: Users, label: "Organizers", val: trip.organizedBy.join(', ') },
                { icon: Phone, label: "Emergency", val: trip.emergencyContact },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-card border shadow-sm nature-card-hover">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 h-fit">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</h3>
                    <p className="font-medium text-foreground">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-xl nature-card-hover h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="w-6 h-6" />
                  Safety First
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-primary-foreground/90 font-medium">Please review the rules carefully before registering.</p>
                <ul className="space-y-3">
                  {trip.rules.map((rule, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 shrink-0 opacity-70 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full mt-4 bg-white text-primary hover:bg-white/90">
                  <Download className="mr-2 h-4 w-4" /> Download Consent Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Itinerary */}
        <section id="itinerary" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold mb-4">Journey Roadmap</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A full day of adventure, learning, and making memories that will last a lifetime.</p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-8 relative max-w-2xl mx-auto">
             {trip.itinerary.map((day) => (
               <div key={day.day} className="space-y-4">
                 <div className="relative flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl border-4 border-background shadow-lg z-10">
                      {day.day}
                    </div>
                 </div>
                 <Card className="h-full border shadow-md nature-card-hover overflow-hidden">
                   <div className="h-2 bg-primary" />
                   <CardHeader>
                     <CardTitle className="text-xl">{day.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground leading-relaxed">
                       {day.description}
                     </p>
                     <div className="flex flex-wrap gap-2 pt-2">
                       {day.activities.map((act, i) => (
                         <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                           {act}
                         </Badge>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </div>
             ))}
          </div>
        </section>

        {/* Packing List */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-6 flex items-center gap-3">
                <Waves className="text-primary" />
                Essential Packing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {trip.packingList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-64 md:h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/backpack/800/600" 
                alt="Backpack" 
                fill 
                className="object-cover"
                data-ai-hint="camping gear"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section id="register" className="max-w-3xl mx-auto scroll-mt-24">
          <Card className="shadow-2xl border-primary/20 overflow-hidden">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-headline font-bold">Secure Your Spot</CardTitle>
              <CardDescription>Fill out the form below to register for the Nameri Trip</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold">Registration Submitted!</h3>
                  <p className="text-muted-foreground">Thank you for registering, {formData.fullName.split(' ')[0]}. Our teachers will review your submission and you'll be notified of the approval.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">Submit another registration</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" placeholder="Enter your full name" required value={formData.fullName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classSection">Class / Section</Label>
                      <Input id="classSection" name="classSection" placeholder="e.g. 12-A" required value={formData.classSection} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="10-digit mobile number" required type="tel" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianContact">Guardian Emergency Contact</Label>
                      <Input id="guardianContact" name="guardianContact" placeholder="Guardian's phone number" required type="tel" value={formData.guardianContact} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions (If any)</Label>
                    <Textarea id="medicalConditions" name="medicalConditions" placeholder="Please list any allergies, medications, or health concerns..." value={formData.medicalConditions} onChange={handleInputChange} />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 transition-transform active:scale-95 shadow-md" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Confirm Registration"}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-bold">By clicking confirm, you agree to follow the trip guidelines and safety rules.</p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <TreeDeciduous className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold font-headline text-primary">Nameri Voyage</span>
            </div>
            <p className="text-sm text-muted-foreground">Arunodoi Academy's premier excursion program. Connecting students with nature through adventure and learning.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-widest text-xs text-primary">Contact Us</h4>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>School Office: +91 361-2345678</p>
              <p>Email: trips@arunodoiacademy.edu</p>
              <p>Emergency: +91 98765-43210</p>
            </div>
          </div>
          <div className="space-y-4">
             <h4 className="font-bold uppercase tracking-widest text-xs text-primary">Admin Access</h4>
             <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" asChild>
               <Link href="/admin">Teacher Login Portal</Link>
             </Button>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-muted-foreground border-t pt-8">
          &copy; {new Date().getFullYear()} Arunodoi Academy. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
