
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeliveryStatusCard from '@/components/deliveries/DeliveryStatusCard';

interface Delivery {
  id: string;
  patientName: string;
  medication: string;
  address: string;
  deliveryDate: string;
  status: 'pending' | 'processing' | 'in_transit' | 'delivered';
  paymentStatus: 'paid' | 'unpaid';
}

const Deliveries = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock data
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      patientName: 'John Smith',
      medication: 'Metformin 500mg',
      address: '123 Main St, Anytown, ST 12345',
      deliveryDate: 'Apr 10, 2025',
      status: 'pending',
      paymentStatus: 'unpaid',
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      medication: 'Synthroid 88mcg',
      address: '456 Oak Ave, Anytown, ST 12346',
      deliveryDate: 'Apr 8, 2025',
      status: 'processing',
      paymentStatus: 'paid',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      medication: 'Lisinopril 10mg',
      address: '789 Pine Ln, Anytown, ST 12347',
      deliveryDate: 'Apr 9, 2025',
      status: 'in_transit',
      paymentStatus: 'paid',
    },
    {
      id: '4',
      patientName: 'Emily Davis',
      medication: 'Levothyroxine 50mcg',
      address: '101 Cedar Blvd, Anytown, ST 12348',
      deliveryDate: 'Apr 11, 2025',
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      id: '5',
      patientName: 'Robert Wilson',
      medication: 'Glipizide 5mg',
      address: '202 Birch Ct, Anytown, ST 12349',
      deliveryDate: 'Apr 12, 2025',
      status: 'pending',
      paymentStatus: 'unpaid',
    },
    {
      id: '6',
      patientName: 'Jennifer Taylor',
      medication: 'Synthroid 75mcg',
      address: '303 Elm Dr, Anytown, ST 12350',
      deliveryDate: 'Apr 14, 2025',
      status: 'processing',
      paymentStatus: 'paid',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, status: newStatus as Delivery['status'] } : delivery
    ));
    
    toast({
      title: "Delivery Status Updated",
      description: `Delivery status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const handlePaymentStatusChange = (id: string, newStatus: string) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, paymentStatus: newStatus as 'paid' | 'unpaid' } : delivery
    ));
    
    toast({
      title: "Payment Status Updated",
      description: `Payment status changed to ${newStatus}.`,
    });
  };

  // Filter deliveries based on search query and status filter
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medication Deliveries</h1>
          <p className="text-muted-foreground">
            Track and manage medication deliveries to patients
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Delivery
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search deliveries..."
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStatusFilter('all')}>
          <Truck className="mr-2 h-4 w-4" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeliveries.map(delivery => (
          <DeliveryStatusCard 
            key={delivery.id} 
            delivery={delivery} 
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
          />
        ))}
        
        {filteredDeliveries.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <p className="text-lg font-medium">No deliveries found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliveries;
