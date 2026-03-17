"use client";

import React, { useState } from 'react';
import { useNameriStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Map, Bell, Search, CheckCircle, XCircle, Trash2, 
  Wand2, Save, Plus, LogOut, ExternalLink, Shield, Lock,
  Banknote, CreditCard
} from 'lucide-react';
import { suggestPackingList } from '@/ai/flows/suggest-packing-list';
import { generateTripAnnouncements } from '@/ai/flows/generate-trip-announcements-flow';
import { generateItineraryDescription } from '@/ai/flows/generate-itinerary-description';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { 
    trip, students, announcements, isInitialized, 
    saveTrip, updateStudentStatus, updateFeesStatus, deleteStudent, addAnnouncement, deleteAnnouncement 
  } = useNameriStore();
  const { toast } = useToast();
  
  // Local state for editing
  const [editingTrip, setEditingTrip] = useState(trip);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Nameri@26') {
      setIsAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome to the Nameri Voyage management console." });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid administrator password." });
    }
  };

  const handleUpdateTrip = () => {
    saveTrip(editingTrip);
    toast({ title: "Settings Saved", description: "Trip details updated successfully." });
  };

  const handleGeneratePackingList = async () => {
    setIsAiLoading(true);
    try {
      const activities = editingTrip.itinerary.flatMap(i => i.activities);
      const res = await suggestPackingList({
        location: editingTrip.location,
        durationDays: 1,
        activities: activities
      });
      setEditingTrip(prev => ({ ...prev, packingList: res.packingList }));
      toast({ title: "AI Generated", description: "Packing list updated with AI suggestions." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate packing list." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateAnnounce = async () => {
    if (!announcementForm.title) return;
    setIsAiLoading(true);
    try {
      const res = await generateTripAnnouncements({
        tripName: trip.name,
        announcementTopic: announcementForm.title,
        announcementDetails: announcementForm.content || "General reminder for all participants.",
        currentDate: new Date().toLocaleDateString()
      });
      setAnnouncementForm(prev => ({ ...prev, content: res.announcementText }));
      toast({ title: "Draft Created", description: "AI has polished your announcement." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate announcement text." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateItineraryDesc = async (idx: number) => {
    setIsAiLoading(true);
    try {
      const item = editingTrip.itinerary[idx];
      const res = await generateItineraryDescription({
        tripName: trip.name,
        location: trip.location,
        activity: item.title,
        duration: "Full Day",
        details: item.activities.join(", ")
      });
      const newItin = [...editingTrip.itinerary];
      newItin[idx] = { ...newItin[idx], description: res.description };
      setEditingTrip(prev => ({ ...prev, itinerary: newItin }));
      toast({ title: "Content Enhanced", description: "Itinerary description improved by AI." });
    } catch (e) {
       toast({ variant: "destructive", title: "AI Error", description: "Failed to generate description." });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <div className="h-2 bg-primary" />
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-primary w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Admin Access</CardTitle>
            <CardDescription>Enter administrator password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-11 text-lg font-semibold bg-primary hover:bg-primary/90">
                Unlock Portal
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t pt-4 bg-muted/30">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Secure Teacher Access Only</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const approvedCount = students.filter(s => s.status === 'approved').length;
  const feesPaidCount = students.filter(s => s.feesStatus === 'paid').length;

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.classSection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-primary w-6 h-6" />
            <h1 className="font-headline font-bold text-xl hidden md:block text-primary">Nameri Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="/" target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> Live Site</a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2 px-4">
              <CardTitle className="text-xs font-medium opacity-80 uppercase tracking-wider">Total</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold">{students.length}</div>
              <p className="text-[10px] opacity-60 mt-1 truncate">Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold text-secondary">{approvedCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fees</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-1">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                {feesPaidCount}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">Paid Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Slots</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl md:text-3xl font-bold">40</div>
              <div className="w-full bg-muted rounded-full h-1 mt-3 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(approvedCount / 40) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" /> Students</TabsTrigger>
            <TabsTrigger value="trip" className="gap-2"><Map className="w-4 h-4" /> Content</TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2"><Bell className="w-4 h-4" /> Broadcast</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="shadow-sm border">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-7">
                <div>
                  <CardTitle>Registrations</CardTitle>
                  <CardDescription>Verify attendance and track fee payments.</CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Filter by name or class..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Medical Note</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          <TableCell>{student.classSection}</TableCell>
                          <TableCell>
                            <span className={student.medicalConditions !== 'None' ? "text-destructive font-bold" : "text-muted-foreground"}>
                              {student.medicalConditions}
                            </span>
                          </TableCell>
                          <TableCell>
                            <button 
                              onClick={() => updateFeesStatus(student.id, student.feesStatus === 'paid' ? 'unpaid' : 'paid')}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              <Badge 
                                variant={student.feesStatus === 'paid' ? 'default' : 'outline'} 
                                className={student.feesStatus === 'paid' ? "bg-blue-500 hover:bg-blue-600 cursor-pointer gap-1" : "cursor-pointer gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"}
                              >
                                <Banknote className="w-3 h-3" />
                                {student.feesStatus.toUpperCase()}
                              </Badge>
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'approved' ? 'default' : student.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize">
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {student.status === 'pending' && (
                              <>
                                <Button size="icon" variant="ghost" className="text-secondary hover:bg-secondary/10" onClick={() => updateStudentStatus(student.id, 'approved')}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => updateStudentStatus(student.id, 'rejected')}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="icon" variant="ghost" className="text-muted-foreground" onClick={() => deleteStudent(student.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredStudents.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No students found matching your search.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trip">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Trip Overview</CardTitle>
                  <CardDescription>Global settings for the Nameri Voyage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Location</Label>
                       <Input value={editingTrip.location} onChange={e => setEditingTrip(p => ({ ...p, location: e.target.value }))} />
                     </div>
                     <div className="space-y-2">
                       <Label>Duration</Label>
                       <Input value={editingTrip.duration} onChange={e => setEditingTrip(p => ({ ...p, duration: e.target.value }))} />
                     </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Packing List</Label>
                        <Button variant="outline" size="sm" onClick={handleGeneratePackingList} disabled={isAiLoading} className="h-7 text-xs border-primary text-primary hover:bg-primary/5">
                          <Wand2 className="w-3 h-3 mr-1" /> Use AI Suggestion
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg min-h-[100px]">
                        {editingTrip.packingList.map((item, i) => (
                          <Badge key={i} variant="secondary" className="pr-1 gap-1">
                            {item}
                            <button className="hover:text-destructive" onClick={() => setEditingTrip(p => ({ ...p, packingList: p.packingList.filter((_, idx) => idx !== i) }))}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        <Input 
                          placeholder="New item + Enter" 
                          className="h-7 w-32 inline-flex border-none shadow-none bg-transparent" 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              if (val) {
                                setEditingTrip(p => ({ ...p, packingList: [...p.packingList, val] }));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button className="w-full gap-2" onClick={handleUpdateTrip}>
                    <Save className="w-4 h-4" /> Save Live Changes
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-headline">Itinerary Planner</h3>
                  <Button variant="outline" size="sm" className="gap-1"><Plus className="w-4 h-4" /> Add Day</Button>
                </div>
                {editingTrip.itinerary.map((day, idx) => (
                  <Card key={day.day}>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{day.day}</div>
                        <Input value={day.title} onChange={e => {
                          const newItin = [...editingTrip.itinerary];
                          newItin[idx].title = e.target.value;
                          setEditingTrip(p => ({ ...p, itinerary: newItin }));
                        }} className="font-bold border-none shadow-none text-lg h-auto p-0 focus-visible:ring-0" />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleGenerateItineraryDesc(idx)} disabled={isAiLoading} className="text-primary hover:bg-primary/5">
                        <Wand2 className="w-4 h-4 mr-1" /> AI Polish
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Textarea 
                        value={day.description} 
                        onChange={e => {
                          const newItin = [...editingTrip.itinerary];
                          newItin[idx].description = e.target.value;
                          setEditingTrip(p => ({ ...p, itinerary: newItin }));
                        }} 
                        className="text-sm min-h-[80px]"
                       />
                       <div className="space-y-2">
                         <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Key Activities</Label>
                         <div className="flex flex-wrap gap-2">
                           {day.activities.map((act, i) => (
                             <Badge key={i} variant="outline" className="text-[10px]">{act}</Badge>
                           ))}
                         </div>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Broadcast Message</CardTitle>
                  <CardDescription>Notify students about updates instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input 
                      placeholder="e.g. Weather Alert" 
                      value={announcementForm.title} 
                      onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Message</Label>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={handleGenerateAnnounce} disabled={isAiLoading}>
                        <Wand2 className="w-3 h-3 mr-1" /> AI Draft
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Type details..." 
                      className="min-h-[150px]"
                      value={announcementForm.content}
                      onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))}
                    />
                  </div>
                  <Button className="w-full gap-2 h-11 bg-primary hover:bg-primary/90" onClick={() => {
                    if (announcementForm.title && announcementForm.content) {
                      addAnnouncement(announcementForm.title, announcementForm.content);
                      setAnnouncementForm({ title: '', content: '' });
                      toast({ title: "Broadcast Sent" });
                    }
                  }}>
                    <Plus className="w-4 h-4" /> Publish Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Active Feed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-4 rounded-lg border bg-muted/20 relative group hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-primary">{ann.title}</h4>
                        <span className="text-xs text-muted-foreground">{ann.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ann.content}</p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="icon" variant="ghost" className="text-destructive h-8 w-8 hover:bg-destructive/10" onClick={() => deleteAnnouncement(ann.id)}>
                           <Trash2 className="w-4 h-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground italic">No active announcements.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
