
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
  Users, Bell, Search, CheckCircle, XCircle, Trash2, 
  Save, LogOut, Shield, Lock, CreditCard, ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { 
    students, announcements, isInitialized, 
    updateStudentStatus, updateFeesStatus, deleteStudent, addAnnouncement, deleteAnnouncement 
  } = useNameriStore();
  const { toast } = useToast();
  
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Nameri@26') {
      setIsAuthenticated(true);
      toast({ title: "Access Granted" });
    } else {
      toast({ variant: "destructive", title: "Access Denied" });
    }
  };

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm shadow-2xl border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-primary w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Admin Portal</CardTitle>
            <CardDescription>Enter password to manage Voyage</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Unlock</Button>
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
      <header className="bg-white border-b sticky top-0 z-40 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-primary w-5 h-5" />
          <h1 className="font-headline font-bold text-lg text-primary hidden md:block">Voyage Command</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild><a href="/"><ExternalLink className="w-4 h-4 mr-1" /> View Site</a></Button>
          <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}><LogOut className="w-4 h-4 mr-1" /> Exit</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", val: students.length, color: "bg-primary" },
            { label: "Approved", val: approvedCount, color: "bg-secondary" },
            { label: "Paid", val: feesPaidCount, color: "bg-blue-600" },
            { label: "Capacity", val: 40, color: "bg-muted text-foreground" },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.color} text-white border-none shadow-md`}>
              <CardContent className="p-4 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold opacity-80">{stat.label}</span>
                <span className="text-2xl font-bold">{stat.val}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" /> Students</TabsTrigger>
            <TabsTrigger value="broadcast" className="gap-2"><Bell className="w-4 h-4" /> Broadcast</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Voyage Roster</CardTitle>
                  <CardDescription>Real-time enrollment tracking</CardDescription>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter..." className="pl-9 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="px-0 md:px-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.fullName}</TableCell>
                          <TableCell>{s.classSection}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={s.feesStatus === 'paid' ? 'default' : 'outline'} 
                              className={`cursor-pointer gap-1 text-[10px] ${s.feesStatus === 'paid' ? 'bg-blue-500' : 'text-blue-600'}`}
                              onClick={() => updateFeesStatus(s.id, s.feesStatus === 'paid' ? 'unpaid' : 'paid')}
                            >
                              <CreditCard className="w-3 h-3" /> {s.feesStatus.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={s.status === 'approved' ? 'default' : s.status === 'rejected' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            {s.status === 'pending' && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => updateStudentStatus(s.id, 'approved')} className="text-secondary h-8 w-8"><CheckCircle className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => updateStudentStatus(s.id, 'rejected')} className="text-destructive h-8 w-8"><XCircle className="w-4 h-4" /></Button>
                              </>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => deleteStudent(s.id)} className="h-8 w-8"><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="broadcast">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 h-fit">
                <CardHeader><CardTitle>New Broadcast</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1"><Label className="text-xs font-bold uppercase">Topic</Label><Input placeholder="e.g. Weather Alert" value={announcementForm.title} onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div className="space-y-1"><Label className="text-xs font-bold uppercase">Message</Label><Textarea placeholder="..." className="min-h-[100px]" value={announcementForm.content} onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))} /></div>
                  <Button className="w-full font-bold" onClick={() => {
                    if (announcementForm.title && announcementForm.content) {
                      addAnnouncement(announcementForm.title, announcementForm.content);
                      setAnnouncementForm({ title: '', content: '' });
                      toast({ title: "Sent" });
                    }
                  }}>Publish Now</Button>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader><CardTitle>Active Feed</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-4 rounded-lg border bg-muted/20 relative group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm">{ann.title}</h4>
                        <span className="text-[10px] text-muted-foreground">{ann.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{ann.content}</p>
                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive h-7 w-7" onClick={() => deleteAnnouncement(ann.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
