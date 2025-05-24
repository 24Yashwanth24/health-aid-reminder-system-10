
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Truck, MapPin, Calendar, User, Package, Phone } from 'lucide-react';
import DeliveryStatusCard from '@/components/deliveries/DeliveryStatusCard';
import { supabase } from '@/integrations/supabase/client';

interface Delivery {
  id: string;
  patientName: string;
  medication: string;
  address: string;
  deliveryDate: string;
  status: 'scheduled' | 'in-transit' | 'delivered' | 'failed';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentAmount: number;
  phone?: string;
}

const Deliveries = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
    
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
          fetchDeliveries();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to fetch delivery data",
          variant: "destructive",
        });
        return;
      }

      // Transform patients data to deliveries format
      const transformedDeliveries = data.map(patient => ({
        id: patient.id,
        patientName: patient.name,
        medication: patient.medication,
        address: patient.address,
        deliveryDate: patient.next_refill_date,
        status: (patient.status as 'scheduled' | 'in-transit' | 'delivered' | 'failed') || 'scheduled',
        paymentStatus: (patient.payment_status as 'paid' | 'pending' | 'failed') || 'pending',
        paymentAmount: patient.amt || 1500,
        phone: patient.phone
      }));

      setDeliveries(transformedDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch delivery data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', deliveryId);

      if (error) {
        console.error('Error updating delivery status:', error);
        toast({
          title: "Error",
          description: "Failed to update delivery status",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === deliveryId
            ? { ...delivery, status: newStatus as 'scheduled' | 'in-transit' | 'delivered' | 'failed' }
            : delivery
        )
      );

      toast({
        title: "Status Updated",
        description: `Delivery status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      });
    }
  };

  // Filter deliveries based on search query and filters
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesTab = activeTab === 'all' || delivery.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading deliveries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery Management</h1>
          <p className="text-muted-foreground">Track and manage medication deliveries</p>
        </div>
        <Truck className="h-8 w-8 text-health-600" />
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
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {filteredDeliveries.map(delivery => (
          <DeliveryStatusCard
            key={delivery.id}
            delivery={delivery}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No deliveries found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Deliveries;
