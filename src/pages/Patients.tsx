
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';
import PatientCard from '@/components/patients/PatientCard';
import PatientForm from '@/components/patients/PatientForm';
import { differenceInDays, format, parse } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LogoutButton from '@/components/auth/LogoutButton';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  next_refill_date: string;
  nextRefill: string;
  daysRemaining: number;
  phone: string;
  paymentStatus?: 'paid' | 'unpaid' | 'pending';
  gender?: string;
  medication?: string;
  address?: string;
}

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected Patient interface
        const formattedPatients = data.map(patient => {
          const nextRefill = format(new Date(patient.next_refill_date), 'MMM d, yyyy');
          const daysRemaining = differenceInDays(new Date(patient.next_refill_date), new Date());

          return {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            condition: patient.condition || '',
            next_refill_date: patient.next_refill_date,
            nextRefill: nextRefill,
            daysRemaining: daysRemaining,
            phone: patient.phone || '',
            paymentStatus: (patient.payment_status as 'paid' | 'unpaid' | 'pending') || 'pending',
            gender: patient.gender || '',
            medication: patient.medication || '',
            address: patient.address || '',
          };
        });

        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Could not fetch patients data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    
    // Set up real-time subscription for changes to the patients table
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchPatients();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const calculateDaysRemaining = (nextRefillDate: string) => {
    const refillDate = parse(nextRefillDate, 'MMM d, yyyy', new Date());
    return differenceInDays(refillDate, new Date());
  };

  const handleAddPatient = async (data: any) => {
    try {
      const today = new Date();
      const next_refill_date = format(data.nextRefillDate, 'yyyy-MM-dd');

      const newPatient = {
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        condition: data.condition,
        medication: data.medication,
        next_refill_date: next_refill_date,
        phone: data.phone,
        address: data.address,
        payment_status: 'pending',
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      const { error } = await supabase.from('patients').insert(newPatient);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Patient added successfully",
      });

      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Could not add patient",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      
      // We'll rely on the subscription to update the list
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Could not delete patient",
        variant: "destructive",
      });
    }
  };

  // Filter patients based on search query and active tab
  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'urgent') return matchesSearch && patient.daysRemaining <= 3;
    if (activeTab === 'upcoming') return matchesSearch && patient.daysRemaining > 3 && patient.daysRemaining <= 7;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and medication schedules</p>
        </div>
        <div className="flex items-center gap-4">
          <LogoutButton />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onSubmit={handleAddPatient} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="urgent">Urgent Refills</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onDelete={handleDeletePatient} 
            />
          ))}

          {filteredPatients.length === 0 && !isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg font-medium">No patients found</p>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Patients;
