
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Indian, Cash, CheckCircle, Search, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Payments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [upiId, setUpiId] = useState('');

  // Mock payment data
  const payments = [
    { id: '1', patientName: 'Rajesh Kumar', date: 'Apr 5, 2025', amount: 850, status: 'pending', method: 'card' },
    { id: '2', patientName: 'Priya Sharma', date: 'Apr 8, 2025', amount: 1200, status: 'paid', method: 'cash' },
    { id: '3', patientName: 'Vikram Singh', date: 'Apr 10, 2025', amount: 650, status: 'paid', method: 'upi' },
    { id: '4', patientName: 'Ananya Patel', date: 'Apr 12, 2025', amount: 950, status: 'pending', method: 'card' },
    { id: '5', patientName: 'Rohit Verma', date: 'Apr 15, 2025', amount: 780, status: 'paid', method: 'cash' },
  ];

  // Filter payments based on search query and active tab
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleProcessPayment = (paymentId: string) => {
    toast({
      title: "Payment Processed",
      description: `Payment has been marked as ${paymentMethod === 'card' ? 'processed via card' : paymentMethod === 'cash' ? 'received in cash' : 'received via UPI'}`,
    });
    setDialogOpen(false);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Cash className="h-4 w-4" />;
      case 'upi':
        return <Indian className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
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
          {filteredPayments.map(payment => (
            <Card key={payment.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg font-medium">{payment.patientName}</CardTitle>
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
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Process Payment</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Process Payment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="text-lg font-medium">
                            Patient: {payment.patientName}
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
                                <Cash className={`h-5 w-5 ${paymentMethod === 'cash' ? 'text-health-500' : 'text-gray-500'}`} />
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
                                <Indian className={`h-5 w-5 ${paymentMethod === 'upi' ? 'text-health-500' : 'text-gray-500'}`} />
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
          ))}

          {filteredPayments.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
              <p className="text-lg font-medium">No payments found</p>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
