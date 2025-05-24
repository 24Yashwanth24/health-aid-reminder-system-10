
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

interface Payment {
  id: string;
  patient_name: string;
  amount: number;
  status: string;
  payment_mode: string | null;
  medication_name: string;
  created_at: string;
  refill_date: string;
  refill_days?: number;
}

const Payments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    
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
          fetchPayments();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payments data",
          variant: "destructive",
        });
        return;
      }

      // Transform patients data to payments format
      const paymentsWithRefillDays = data.map(patient => {
        const refillDate = new Date(patient.next_refill_date);
        const today = new Date();
        const diffTime = refillDate.getTime() - today.getTime();
        const refillDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          id: patient.id,
          patient_name: patient.name,
          amount: patient.amt || 1500,
          status: patient.payment_status || 'pending',
          payment_mode: null,
          medication_name: patient.medication,
          created_at: patient.created_at,
          refill_date: patient.next_refill_date,
          refill_days: refillDays > 0 ? refillDays : 0
        };
      });

      setPayments(paymentsWithRefillDays);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpiId('');
    setDialogOpen(true);
  };

  const handleCompletePayment = async () => {
    if (!selectedPayment) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update({ 
          payment_status: 'paid'
        })
        .eq('id', selectedPayment.id);

      if (error) {
        console.error('Error updating payment:', error);
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === selectedPayment.id 
            ? { 
                ...payment, 
                status: 'paid', 
                payment_mode: paymentMethod 
              } 
            : payment
        )
      );

      let successMessage = `${selectedPayment.patient_name}'s payment of ₹${selectedPayment.amount} marked as completed via ${paymentMethod}.`;
      
      if (paymentMethod === 'upi') {
        successMessage += ` UPI ID: ${upiId}`;
      }
      
      toast({
        title: "Payment Processed Successfully",
        description: successMessage,
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  // Filter payments based on search query and active tab
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.medication_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getPaymentUrgency = (refillDays: number) => {
    if (refillDays <= 3) return "bg-red-100 text-red-800";
    if (refillDays <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading payments...</div>
      </div>
    );
  }

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
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        
        <Tabs defaultValue="pending" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
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
                  <CardTitle className="text-lg font-medium">{payment.patient_name}</CardTitle>
                  <p className="text-sm text-gray-500">{payment.medication_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    payment.status === 'paid' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {payment.status}
                </Badge>
                
                {payment.status === 'pending' && payment.refill_days !== undefined && (
                  <Badge className={getPaymentUrgency(payment.refill_days)}>
                    {payment.refill_days} days to refill
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
                
                {payment.payment_mode && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="font-medium capitalize flex items-center">
                      {payment.payment_mode === 'cash' ? (
                        <><IndianRupee className="h-3 w-3 mr-1" /> Cash</>
                      ) : payment.payment_mode === 'upi' ? (
                        <><CreditCard className="h-3 w-3 mr-1" /> UPI</>
                      ) : payment.payment_mode === 'card' ? (
                        <><CreditCard className="h-3 w-3 mr-1" /> Card</>
                      ) : payment.payment_mode}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Refill Date</div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(payment.refill_date)}
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
              Select a payment method to process {selectedPayment?.patient_name}'s payment of ₹{selectedPayment?.amount}
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
            
            {paymentMethod === 'upi' && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="upi-id">Patient's UPI ID</Label>
                <Input 
                  id="upi-id" 
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  This UPI ID will be recorded for verification purposes
                </p>
              </div>
            )}
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
              disabled={paymentMethod === 'upi' && !upiId.trim()}
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
