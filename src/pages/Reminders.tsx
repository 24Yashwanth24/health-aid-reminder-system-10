
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bell } from 'lucide-react';
import ReminderList from '@/components/reminders/ReminderList';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  patientName: string;
  medication: string;
  refillDate: string;
  daysRemaining: number;
  status: 'pending' | 'sent' | 'contacted' | 'completed';
  contactNumber: string;
}

const Reminders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data with Indian names
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      patientName: 'Rajesh Kumar',
      medication: 'Metformin 500mg',
      refillDate: 'Apr 10, 2025',
      daysRemaining: 4,
      status: 'pending',
      contactNumber: '(923) 456-7890',
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      medication: 'Levothyroxine 88mcg',
      refillDate: 'Apr 8, 2025',
      daysRemaining: 2,
      status: 'sent',
      contactNumber: '(834) 567-8901',
    },
    {
      id: '3',
      patientName: 'Vikram Singh',
      medication: 'Lisinopril 10mg',
      refillDate: 'Apr 15, 2025',
      daysRemaining: 9,
      status: 'contacted',
      contactNumber: '(745) 678-9012',
    },
    {
      id: '4',
      patientName: 'Ananya Patel',
      medication: 'Levothyroxine 50mcg',
      refillDate: 'Apr 20, 2025',
      daysRemaining: 14,
      status: 'pending',
      contactNumber: '(656) 789-0123',
    },
    {
      id: '5',
      patientName: 'Rohit Verma',
      medication: 'Glipizide 5mg',
      refillDate: 'Apr 7, 2025',
      daysRemaining: 1,
      status: 'pending',
      contactNumber: '(567) 890-1234',
    },
    {
      id: '6',
      patientName: 'Sunita Agarwal',
      medication: 'Levothyroxine 75mcg',
      refillDate: 'Apr 18, 2025',
      daysRemaining: 12,
      status: 'completed',
      contactNumber: '(678) 901-2345',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: Reminder['status']) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, status: newStatus } : reminder
    ));
  };

  const handleSendAllReminders = () => {
    const urgentReminders = reminders.filter(r => 
      r.status === 'pending' && r.daysRemaining <= 7
    );
    
    if (urgentReminders.length === 0) {
      toast({
        title: "No Urgent Reminders",
        description: "There are no urgent reminders that need to be sent.",
      });
      return;
    }
    
    setReminders(reminders.map(reminder => 
      reminder.status === 'pending' && reminder.daysRemaining <= 7 
        ? { ...reminder, status: 'sent' } 
        : reminder
    ));
    
    toast({
      title: "Reminders Sent",
      description: `${urgentReminders.length} reminders have been sent to patients.`,
    });
  };

  // Filter reminders based on search query, status filter and active tab
  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = 
      reminder.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.medication.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reminder.status === statusFilter;
    
    if (activeTab === 'all') return matchesSearch && matchesStatus;
    if (activeTab === 'urgent') return matchesSearch && matchesStatus && reminder.daysRemaining <= 3;
    if (activeTab === 'upcoming') return matchesSearch && matchesStatus && reminder.daysRemaining > 3 && reminder.daysRemaining <= 7;
    if (activeTab === 'later') return matchesSearch && matchesStatus && reminder.daysRemaining > 7;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medication Reminders</h1>
          <p className="text-muted-foreground">
            Schedule and send medication refill reminders to patients
          </p>
        </div>
        <Button onClick={handleSendAllReminders}>
          <Bell className="mr-2 h-4 w-4" />
          Send All Urgent Reminders
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search reminders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto flex-1 sm:max-w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="later">Later</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ReminderList 
        reminders={filteredReminders} 
        onStatusChange={handleStatusChange} 
      />
      
      {filteredReminders.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-medium">No reminders found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Reminders;
