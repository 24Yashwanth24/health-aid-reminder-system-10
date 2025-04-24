
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, CheckCircle, Search, Plus } from 'lucide-react';
import { BadgeIndianRupee, BanknoteIcon } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Sample mock data for when Supabase is not available
const MOCK_PAYMENTS = [
  {
    id: '1',
    patient_name: 'John Doe',
    amount: 1500,
    status: 'pending',
    method: 'card',
    date: '2025-04-20',
    created_at: '2025-04-20T10:00:00Z',
    updated_at: '2025-04-20T10:00:00Z'
  },
  {
    id: '2',
    patient_name: 'Jane Smith',
    amount: 2500,
    status: 'paid',
    method: 'cash',
    date: '2025-04-19',
    created_at: '2025-04-19T11:00:00Z',
    updated_at: '2025-04-19T15:30:00Z'
  },
  {
    id: '3',
    patient_name: 'Amit Patel',
    amount: 3000,
    status: 'pending',
    method: 'upi',
    date: '2025-04-18',
    created_at: '2025-04-18T09:00:00Z',
    updated_at: '2025-04-18T09:00:00Z'
  }
];

// Create a function to initialize Supabase client safely
const initSupabase = () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials missing. Using mock data instead.');
      return null;
    }
    
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

// Initialize Supabase client
const supabase = initSupabase();

const Payments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(!supabase);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      // If Supabase client is not available, return mock data
      if (!supabase) {
        console.log('Using mock payment data');
        setIsUsingMockData(true);
        return MOCK_PAYMENTS;
      }
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching payments:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Query error:', err);
        setIsUsingMockData(true);
        return MOCK_PAYMENTS; // Fallback to mock data on error
      }
    },
    enabled: true // Always run the query, with or without Supabase
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, method }: { id: string; method: string }) => {
      if (!supabase) {
        // Simulate API delay with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock success response
        return { success: true };
      }
      
      const { data, error } = await supabase
        .from('payments')
        .update({ status: 'paid', method })
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Payment Processed",
        description: `Payment has been marked as ${paymentMethod === 'card' ? 'processed via card' : paymentMethod === 'cash' ? 'received in cash' : 'received via UPI'}`,
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleProcessPayment = (paymentId: string) => {
    updatePaymentMutation.mutate({ id: paymentId, method: paymentMethod });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <BanknoteIcon className="h-4 w-4" />;
      case 'upi':
        return <BadgeIndianRupee className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">Process and track patient payments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Payment
        </Button>
      </div>

      {isUsingMockData && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Using demo data. To connect to a real database, please set up your Supabase environment variables.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="pending" className="w-full sm:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-500"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
            <p className="text-lg font-medium">No payments found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredPayments.map(payment => (
            <Card key={payment.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg font-medium">{payment.patient_name}</CardTitle>
                <Badge className={payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {payment.status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{payment.date}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-medium">₹{payment.amount.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Payment Method</div>
                    <div className="flex items-center gap-1">
                      {getMethodIcon(payment.method)}
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </div>
                  {payment.status === 'pending' ? (
                    <Dialog open={dialogOpen && selectedPaymentId === payment.id} onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (open) {
                        setSelectedPaymentId(payment.id);
                      } else {
                        setSelectedPaymentId(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button>Process Payment</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Process Payment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="text-lg font-medium">
                            Patient: {payment.patient_name}
                          </div>
                          <div className="text-2xl font-bold">
                            Amount: ₹{payment.amount.toFixed(2)}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Select Payment Method</label>
                            <div className="flex flex-col gap-2">
                              <div 
                                className={`border rounded-md p-3 flex items-center gap-3 cursor-pointer ${paymentMethod === 'card' ? 'border-health-500 bg-health-50' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                              >
                                <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-health-500' : 'text-gray-500'}`} />
                                <div className="flex-1">
                                  <div className="font-medium">Card Payment</div>
                                  <div className="text-sm text-gray-500">Process debit/credit card payment</div>
                                </div>
                                {paymentMethod === 'card' && <CheckCircle className="h-5 w-5 text-health-500" />}
                              </div>
                              
                              <div 
                                className={`border rounded-md p-3 flex items-center gap-3 cursor-pointer ${paymentMethod === 'cash' ? 'border-health-500 bg-health-50' : ''}`}
                                onClick={() => setPaymentMethod('cash')}
                              >
                                <BanknoteIcon className={`h-5 w-5 ${paymentMethod === 'cash' ? 'text-health-500' : 'text-gray-500'}`} />
                                <div className="flex-1">
                                  <div className="font-medium">Cash Payment</div>
                                  <div className="text-sm text-gray-500">Mark as paid in cash</div>
                                </div>
                                {paymentMethod === 'cash' && <CheckCircle className="h-5 w-5 text-health-500" />}
                              </div>
                              
                              <div 
                                className={`border rounded-md p-3 flex items-center gap-3 cursor-pointer ${paymentMethod === 'upi' ? 'border-health-500 bg-health-50' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                              >
                                <BadgeIndianRupee className={`h-5 w-5 ${paymentMethod === 'upi' ? 'text-health-500' : 'text-gray-500'}`} />
                                <div className="flex-1">
                                  <div className="font-medium">UPI Payment</div>
                                  <div className="text-sm text-gray-500">Process payment via UPI</div>
                                </div>
                                {paymentMethod === 'upi' && <CheckCircle className="h-5 w-5 text-health-500" />}
                              </div>
                            </div>
                          </div>
                          
                          {paymentMethod === 'upi' && (
                            <div className="space-y-2">
                              <label htmlFor="upi-id" className="text-sm font-medium">UPI ID</label>
                              <Input 
                                id="upi-id" 
                                placeholder="e.g., name@upi" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => handleProcessPayment(payment.id)}>
                              Confirm Payment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="outline" disabled>Payment Complete</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Payments;
