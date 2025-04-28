
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WalletCards, Search, CircleDollarSign, IndianRupee, CreditCard, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Payments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [dialogOpen, setDialogOpen] = useState(false);

  const payments = [
    {
      id: '1',
      patientName: 'Rajesh Kumar',
      amount: 1500,
      status: 'pending',
      paymentMethod: '',
      medication: 'Levothyroxine 88mcg',
      date: '2025-04-28',
      dueDate: '2025-05-10',
      refillDays: 5
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'upi',
      medication: 'Metformin 500mg',
      date: '2025-04-27',
      dueDate: '2025-05-15',
      refillDays: 12
    },
    {
      id: '3',
      patientName: 'Vikram Singh',
      amount: 1200,
      status: 'pending',
      paymentMethod: '',
      medication: 'Lisinopril 10mg',
      date: '2025-04-29',
      dueDate: '2025-05-08',
      refillDays: 3
    }
  ];

  const handleProcessPayment = (payment: any) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  const handleCompletePayment = () => {
    toast({
      title: "Payment Processed Successfully",
      description: `${selectedPayment.patientName}'s payment of ₹${selectedPayment.amount} marked as completed via ${paymentMethod}.`,
    });
    setDialogOpen(false);
    // In a real app, this would update the database
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.medication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getPaymentUrgency = (refillDays: number) => {
    if (refillDays <= 3) return "bg-red-100 text-red-800";
    if (refillDays <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

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
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    payment.status === 'completed' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {payment.status}
                </Badge>
                
                {payment.status === 'pending' && (
                  <Badge className={getPaymentUrgency(payment.refillDays)}>
                    {payment.refillDays} days to refill
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium flex items-center">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {payment.amount}
                  </div>
                </div>
                
                {payment.paymentMethod && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="font-medium capitalize flex items-center">
                      {payment.paymentMethod === 'cash' ? (
                        <><IndianRupee className="h-3 w-3 mr-1" /> Cash</>
                      ) : payment.paymentMethod === 'upi' ? (
                        <><CreditCard className="h-3 w-3 mr-1" /> UPI</>
                      ) : payment.paymentMethod === 'card' ? (
                        <><CreditCard className="h-3 w-3 mr-1" /> Card</>
                      ) : payment.paymentMethod}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {payment.dueDate}
                  </div>
                </div>
                
                {payment.status === 'pending' && (
                  <Button 
                    onClick={() => handleProcessPayment(payment)}
                    className="sm:ml-auto bg-health-600 hover:bg-health-700"
                  >
                    Process Payment
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
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Select a payment method to process {selectedPayment?.patientName}'s payment of ₹{selectedPayment?.amount}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2" /> Cash Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" /> UPI Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" /> Card Payment
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCompletePayment}
              className="bg-health-600 hover:bg-health-700"
            >
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
