
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
  Megaphone, TreeDeciduous, Lock, Info, CheckCircle2,
  Phone, User, GraduationCap, Stethoscope
} from 'lucide-react';

export default function LandingPage() {
  const { trip, students, announcements, addStudent } = useNameriStore();
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

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      classSection: '',
      phone: '',
      guardianContact: '',
      medicalConditions: ''
    });
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.classSection || !formData.phone || !formData.guardianContact) {
      toast({ 
        variant: "destructive", 
        title: "Missing Information", 
        description: "Please fill in all mandatory fields." 
      });
      return;
    }

    setIsSubmitting(true);
    
    // Optimistic UI update: Show success immediately while the write happens in background
    addStudent({ ...formData })
      .then(() => {
        // Success handled silently by the UI switch
      })
      .catch((error) => {
        console.error("Submission error:", error);
        setSubmitted(false);
        setIsSubmitting(false);
        toast({ 
          variant: "destructive", 
          title: "Network Error", 
          description: "We couldn't reach the database. Please check your signal." 
        });
      });

    // Immediate feedback
    setSubmitted(true);
    setIsSubmitting(false);
    toast({ 
      title: "Success", 
      description: "Registration request sent." 
    });
  };

  const approvedStudents = students.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth pb-20 sm:pb-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b h-16 flex items-center px-4">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-6 h-6" />
            <span className="font-bold text-primary tracking-tight">Nameri Voyage</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary gap-1.5 rounded-full" asChild>
            <Link href="/admin">
              <Lock className="w-4 h-4" /> 
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage?.imageUrl || ""} 
            alt="Nameri National Park" 
            fill 
            className="object-cover opacity-20" 
            priority 
            data-ai-hint="nature forest"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest py-1.5 px-6 rounded-full">
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-primary tracking-tight leading-[0.9] uppercase">
            LAST TRIP <br/> TO NAMERI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto font-medium leading-relaxed">
            Arunodoi Academy's Class 12 grand finale expedition. One day of pure nature and unforgettable bonding.
          </p>
          <Button size="lg" className="rounded-full px-12 h-16 text-xl bg-primary hover:bg-primary/90 shadow-2xl transition-all hover:scale-105" asChild>
            <a href="#register">Register Now</a>
          </Button>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-24">
        {/* Announcements */}
        {announcements.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-2xl">
                <Megaphone className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Latest Updates</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {announcements.map((ann) => (
                <Card key={ann.id} className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden group rounded-3xl">
                  <div className="h-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-lg font-bold flex justify-between items-start gap-4">
                      {ann.title}
                      <span className="text-[10px] text-muted-foreground font-black uppercase bg-muted/50 px-3 py-1 rounded-full shrink-0 tracking-widest border border-muted-foreground/10">{ann.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">{ann.content}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Participant List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-2xl">
                <Users className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Voyagers Joining Us</h2>
            </div>
            <Badge variant="secondary" className="font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">
              {approvedStudents.length} Confirmed
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            {approvedStudents.map((student) => (
              <div key={student.id} className="bg-white border-2 border-primary/5 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                {student.fullName} 
                <span className="opacity-50 text-[10px] bg-muted px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">
                  {student.classSection}
                </span>
              </div>
            ))}
            {approvedStudents.length === 0 && (
              <div className="w-full py-16 text-center border-4 border-dashed border-muted/30 rounded-[40px] bg-muted/5">
                <p className="text-muted-foreground font-semibold text-lg">Waiting for the first adventurer...</p>
              </div>
            )}
          </div>
        </section>

        {/* Voyage Info & Form */}
        <section className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Expedition <br/>Logistics</h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Detailed schedule for the Class 12 excursion to Nameri National Park. Please ensure you are at the muster point 15 minutes early.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: MapPin, label: "Destinations", val: trip.location },
                { icon: Clock, label: "Departure", val: trip.departureTime },
                { icon: Users, label: "Teachers", val: trip.organizedBy.slice(0, 2).join(', ') },
                { icon: Calendar, label: "Duration", val: "1 Full Day" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4 p-8 rounded-[32px] border-2 border-primary/5 bg-white/40 shadow-sm backdrop-blur-sm">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{item.label}</p>
                    <p className="text-sm font-bold text-foreground leading-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div id="register" className="scroll-mt-24">
            <Card className="shadow-2xl border-none overflow-hidden rounded-[40px] bg-white ring-1 ring-primary/5">
              <div className="h-4 bg-primary" />
              <CardHeader className="text-center p-10 pb-6">
                <CardTitle className="text-3xl font-black tracking-tight">Enrolment</CardTitle>
                <CardDescription className="text-base font-medium">Submit your details for the excursion</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                {submitted ? (
                  <div className="text-center py-16 space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center">
                      <CheckCircle2 className="w-14 h-14 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-3xl font-black text-primary">Done!</p>
                      <p className="text-muted-foreground font-medium max-w-[300px] mx-auto leading-relaxed">
                        Your registration has been submitted. Teachers will review and approve shortly.
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleResetForm} className="w-full rounded-2xl h-14 font-bold text-lg border-2">
                      Register Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        placeholder="Your full name" 
                        required 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className="h-14 rounded-2xl border-2 border-muted bg-muted/20 text-base font-medium px-5" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="classSection" className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Class
                      </Label>
                      <Input 
                        id="classSection" 
                        name="classSection" 
                        placeholder="e.g. 12-A" 
                        required 
                        value={formData.classSection} 
                        onChange={handleInputChange} 
                        className="h-14 rounded-2xl border-2 border-muted bg-muted/20 text-base font-medium px-5" 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" /> My Phone
                        </Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="Phone number" 
                          required 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          className="h-14 rounded-2xl border-2 border-muted bg-muted/20 text-base font-medium px-5" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="guardianContact" className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5" /> Guardian
                        </Label>
                        <Input 
                          id="guardianContact" 
                          name="guardianContact" 
                          placeholder="Emergency contact" 
                          required 
                          type="tel" 
                          value={formData.guardianContact} 
                          onChange={handleInputChange} 
                          className="h-14 rounded-2xl border-2 border-muted bg-muted/20 text-base font-medium px-5" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="medicalConditions" className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5" /> Medical (Optional)
                      </Label>
                      <Textarea 
                        id="medicalConditions" 
                        name="medicalConditions" 
                        placeholder="Any allergies?" 
                        value={formData.medicalConditions} 
                        onChange={handleInputChange} 
                        className="min-h-[100px] rounded-[24px] border-2 border-muted bg-muted/20 text-base font-medium p-5 resize-none" 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-16 font-black text-xl bg-primary hover:bg-primary/90 rounded-[24px] shadow-2xl mt-4 transition-all" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Secure My Spot"}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                      <Info className="w-3 h-3" /> Secure Submission
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <TreeDeciduous className="text-primary w-8 h-8" />
            <span className="font-black text-2xl tracking-tighter text-primary">Nameri Voyage 2026</span>
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.4em] leading-loose">
              &copy; 2026 Arunodoi Academy <br/>
              Class 12 Educational Excursion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
