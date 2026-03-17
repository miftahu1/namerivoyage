
"use client";

import React, { useState, useEffect } from 'react';
import { useNameriStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Bell, Search, CheckCircle, XCircle, Trash2, 
  LogOut, Shield, Lock, CreditCard, ExternalLink
} from 'lucide-react';

const SESSION_KEY = 'nameri_admin_session';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { 
    students, announcements, 
    updateStudentStatus, updateFeesStatus, deleteStudent, addAnnouncement, deleteAnnouncement 
  } = useNameriStore();
  const { toast } = useToast();
  
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { timestamp } = JSON.parse(session);
        const now = Date.now();
        if (now - timestamp < SESSION_TIMEOUT) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Nameri@26') {
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
      toast({ title: "Welcome back, Admin" });
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid password." });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm shadow-2xl border-primary/20 rounded-3xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="text-primary w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription>Enter the secure code to manage Voyage</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 pt-4 px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                autoFocus 
                className="h-12 rounded-2xl text-center text-xl tracking-[0.5em] border-muted-foreground/20"
              />
              <Button type="submit" className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-base shadow-lg">Unlock Dashboard</Button>
            </form>
          </CardContent>
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
      <header className="bg-white border-b sticky top-0 z-40 px-4 h-16 flex items-center justify-between backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2">
          <Shield className="text-primary w-5 h-5" />
          <h1 className="font-bold text-lg text-primary hidden sm:block">Command Center</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-full h-9" asChild><a href="/"><ExternalLink className="w-4 h-4 mr-1" /> <span className="hidden xs:inline">Live Site</span></a></Button>
          <Button variant="outline" size="sm" className="rounded-full h-9 border-destructive/20 text-destructive hover:bg-destructive/10" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", val: students.length, color: "bg-primary" },
            { label: "Confirmed", val: approvedCount, color: "bg-secondary" },
            { label: "Fees Paid", val: feesPaidCount, color: "bg-blue-600" },
            { label: "Capacity", val: 40, color: "bg-muted text-foreground" },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.color} text-white border-none shadow-lg rounded-3xl`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">{stat.label}</span>
                <span className="text-3xl font-black leading-none">{stat.val}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-muted/50 rounded-full p-1 w-full sm:w-auto h-auto grid grid-cols-2">
            <TabsTrigger value="students" className="gap-2 rounded-full py-2.5 px-6"><Users className="w-4 h-4" /> Students</TabsTrigger>
            <TabsTrigger value="broadcast" className="gap-2 rounded-full py-2.5 px-6"><Bell className="w-4 h-4" /> Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 pb-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Voyage Roster</CardTitle>
                  <CardDescription className="text-sm">Manage student approvals and payment status</CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or class..." 
                    className="pl-11 h-12 rounded-2xl border-muted-foreground/10 bg-muted/30" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:px-8 sm:pb-8">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="border-none">
                        <TableHead className="font-bold uppercase text-[11px] tracking-widest">Student</TableHead>
                        <TableHead className="font-bold uppercase text-[11px] tracking-widest hidden xs:table-cell">Class</TableHead>
                        <TableHead className="font-bold uppercase text-[11px] tracking-widest">Fees</TableHead>
                        <TableHead className="font-bold uppercase text-[11px] tracking-widest">Status</TableHead>
                        <TableHead className="text-right font-bold uppercase text-[11px] tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => (
                        <TableRow key={s.id} className="hover:bg-muted/10 border-muted/20">
                          <TableCell className="py-4">
                            <div className="font-bold text-sm">{s.fullName}</div>
                            <div className="text-[10px] text-muted-foreground xs:hidden">{s.classSection}</div>
                          </TableCell>
                          <TableCell className="hidden xs:table-cell py-4">
                            <Badge variant="outline" className="rounded-full px-3 text-[10px] font-bold">{s.classSection}</Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge 
                              variant={s.feesStatus === 'paid' ? 'default' : 'outline'} 
                              className={`cursor-pointer gap-1 px-3 py-1 rounded-full text-[10px] font-black transition-all ${s.feesStatus === 'paid' ? 'bg-blue-500 hover:bg-blue-600' : 'text-blue-600 border-blue-600/20 hover:bg-blue-50'}`}
                              onClick={() => updateFeesStatus(s.id, s.feesStatus === 'paid' ? 'unpaid' : 'paid')}
                            >
                              <CreditCard className="w-3 h-3" /> {s.feesStatus.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant={s.status === 'approved' ? 'default' : s.status === 'rejected' ? 'destructive' : 'secondary'} className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1 py-4">
                            <div className="flex justify-end gap-1">
                              {s.status === 'pending' && (
                                <>
                                  <Button size="icon" variant="ghost" onClick={() => updateStudentStatus(s.id, 'approved')} className="text-secondary h-9 w-9 bg-secondary/10 hover:bg-secondary/20 rounded-xl"><CheckCircle className="w-5 h-5" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => updateStudentStatus(s.id, 'rejected')} className="text-destructive h-9 w-9 bg-destructive/10 hover:bg-destructive/20 rounded-xl"><XCircle className="w-5 h-5" /></Button>
                                </>
                              )}
                              <Button size="icon" variant="ghost" onClick={() => deleteStudent(s.id)} className="h-9 w-9 bg-muted hover:bg-destructive hover:text-white rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredStudents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">No students found matching your criteria.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="broadcast" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 rounded-3xl border-none shadow-xl h-fit">
                <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-bold">New Update</CardTitle></CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Announcement Topic</Label>
                    <Input placeholder="e.g. Departure Reminder" value={announcementForm.title} onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))} className="h-12 rounded-2xl border-muted-foreground/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Message Details</Label>
                    <Textarea placeholder="Share important details with students..." className="min-h-[120px] rounded-2xl border-muted-foreground/10 resize-none" value={announcementForm.content} onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))} />
                  </div>
                  <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-lg bg-primary hover:bg-primary/90" onClick={() => {
                    if (announcementForm.title && announcementForm.content) {
                      addAnnouncement(announcementForm.title, announcementForm.content);
                      setAnnouncementForm({ title: '', content: '' });
                      toast({ title: "Broadcast Published" });
                    }
                  }}>Send Now</Button>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2 rounded-3xl border-none shadow-xl overflow-hidden">
                <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-bold">Active Feed</CardTitle></CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-6 rounded-3xl border border-muted/40 bg-muted/10 relative group hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-base text-primary">{ann.title}</h4>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase bg-white px-3 py-1 rounded-full shadow-sm">{ann.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pr-8">{ann.content}</p>
                      <Button size="icon" variant="ghost" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-destructive h-8 w-8 hover:bg-destructive/10 rounded-full transition-opacity" onClick={() => deleteAnnouncement(ann.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed rounded-3xl">No announcements yet.</div>
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

