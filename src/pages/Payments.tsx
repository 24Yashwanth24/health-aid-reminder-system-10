
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WalletCards, Search, CircleDollarSign } from 'lucide-react';

const Payments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');

  const payments = [
    {
      id: '1',
      patientName: 'Rajesh Kumar',
      amount: 1500,
      status: 'pending',
      paymentMethod: 'cash',
      medication: 'Levothyroxine 88mcg',
      date: '2025-04-28'
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'card',
      medication: 'Metformin 500mg',
      date: '2025-04-27'
    }
  ];

  const handleCompletePayment = (id: string) => {
    toast({
      title: "Payment Completed",
      description: "The payment has been marked as completed.",
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.medication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">Process and track patient payments</p>
        </div>
        <WalletCards className="h-8 w-8 text-health-600" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search payments..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Tabs defaultValue="pending" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {filteredPayments.map(payment => (
          <Card key={payment.id} className="transform transition-all duration-200 hover:scale-[1.01]">
            <CardHeader className="flex flex-row items-center justify-between py-4 bg-gradient-to-r from-health-100 to-transparent">
              <div className="flex items-center space-x-4">
                <CircleDollarSign className="h-5 w-5 text-health-600" />
                <div>
                  <CardTitle className="text-lg font-medium">{payment.patientName}</CardTitle>
                  <p className="text-sm text-gray-500">{payment.medication}</p>
                </div>
              </div>
              <Badge 
                className={
                  payment.status === 'completed' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {payment.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">₹{payment.amount}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-medium capitalize">{payment.paymentMethod}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Date</div>
                  <div>{payment.date}</div>
                </div>
                {payment.status === 'pending' && (
                  <Button 
                    onClick={() => handleCompletePayment(payment.id)}
                    className="sm:ml-auto"
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <p className="text-lg font-medium">No payments found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Payments;
