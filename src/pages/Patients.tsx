
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';
import PatientCard from '@/components/patients/PatientCard';
import PatientForm from '@/components/patients/PatientForm';
import { differenceInDays, format, parse } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  nextRefill: string;
  daysRemaining: number;
  phone: string;
}

const calculateDaysRemaining = (nextRefillDate: string) => {
  const refillDate = parse(nextRefillDate, 'MMM d, yyyy', new Date());
  return differenceInDays(refillDate, new Date());
};

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      age: 65,
      condition: 'Diabetes',
      nextRefill: 'Apr 10, 2025',
      daysRemaining: 4,
      phone: '(123) 456-7890',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 42,
      condition: 'Thyroid',
      nextRefill: 'Apr 8, 2025',
      daysRemaining: 2,
      phone: '(234) 567-8901',
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 58,
      condition: 'Hypertension',
      nextRefill: 'Apr 15, 2025',
      daysRemaining: 9,
      phone: '(345) 678-9012',
    },
    {
      id: '4',
      name: 'Emily Davis',
      age: 36,
      condition: 'Thyroid',
      nextRefill: 'Apr 20, 2025',
      daysRemaining: 14,
      phone: '(456) 789-0123',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      age: 71,
      condition: 'Diabetes',
      nextRefill: 'Apr 7, 2025',
      daysRemaining: 1,
      phone: '(567) 890-1234',
    },
    {
      id: '6',
      name: 'Jennifer Taylor',
      age: 49,
      condition: 'Thyroid',
      nextRefill: 'Apr 18, 2025',
      daysRemaining: 12,
      phone: '(678) 901-2345',
    },
  ]);

  const handleAddPatient = (data: any) => {
    const today = new Date();
    const refillDate = format(data.nextRefillDate, 'MMM d, yyyy');
    const daysRemaining = differenceInDays(data.nextRefillDate, today);
    
    const newPatient: Patient = {
      id: `${patients.length + 1}`,
      name: data.name,
      age: parseInt(data.age),
      condition: data.condition,
      nextRefill: refillDate,
      daysRemaining: daysRemaining,
      phone: data.phone,
    };
    
    setPatients([...patients, newPatient]);
    setDialogOpen(false);
  };

  // Filter patients based on search query and active tab
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <p className="text-muted-foreground">
            Manage your patient records and medication schedules
          </p>
        </div>
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

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
        
        {filteredPatients.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
