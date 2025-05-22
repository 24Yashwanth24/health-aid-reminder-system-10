
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Bell } from 'lucide-react';
import ReminderList from '@/components/reminders/ReminderList';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import LogoutButton from '@/components/auth/LogoutButton';

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
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      // Fetch patients data from Supabase
      const { data, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform patient data into reminders
        const reminderData = data.map(patient => {
          const refillDate = format(new Date(patient.next_refill_date), 'MMM d, yyyy');
          const daysRemaining = differenceInDays(new Date(patient.next_refill_date), new Date());
          
          // Determine status based on days remaining
          let status: 'pending' | 'sent' | 'contacted' | 'completed' = 'pending';
          if (daysRemaining <= 0) {
            status = 'completed';
          } else if (daysRemaining <= 3) {
            status = 'sent';
          }

          return {
            id: patient.id,
            patientName: patient.name,
            medication: patient.medication || 'Not specified',
            refillDate: refillDate,
            daysRemaining: daysRemaining,
            status: status,
            contactNumber: patient.phone || 'Not provided'
          };
        });

        setReminders(reminderData);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Could not fetch reminders data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
    
    // Set up real-time subscription for changes to the patients table
    const subscription = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchReminders();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: Reminder['status']) => {
    // Find the reminder to update
    const reminderToUpdate = reminders.find(r => r.id === id);
    
    if (!reminderToUpdate) {
      toast({
        title: "Error",
        description: "Reminder not found",
        variant: "destructive",
      });
      return;
    }
    
    // Update the local state
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, status: newStatus } : reminder
    ));
    
    toast({
      title: "Status Updated",
      description: `Reminder status updated to ${newStatus}`,
    });
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
        <div className="flex items-center gap-4">
          <LogoutButton />
          <Button onClick={handleSendAllReminders}>
            <Bell className="mr-2 h-4 w-4" />
            Send All Urgent Reminders
          </Button>
        </div>
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

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-600"></div>
        </div>
      ) : (
        <>
          <ReminderList 
            reminders={filteredReminders} 
            onStatusChange={handleStatusChange} 
          />
          
          {filteredReminders.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg font-medium">No reminders found</p>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reminders;
