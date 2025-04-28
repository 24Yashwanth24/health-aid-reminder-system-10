
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/components/user/UserLayout';
import { CircleDollarSign, WalletCards, Calendar, IndianRupee, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const UserPayments = () => {
  const { toast } = useToast();
  const userEmail = localStorage.getItem('authEmail');
  const userName = localStorage.getItem('userName');

  // Mock data for demonstration
  const payments = [
    {
      id: '1',
      amount: 1500,
      dueDate: '2025-05-10',
      medication: 'Levothyroxine 88mcg',
      refillDays: 12,
      status: 'upcoming'
    },
    {
      id: '2',
      amount: 2500,
      dueDate: '2025-05-15',
      medication: 'Metformin 500mg',
      refillDays: 17,
      status: 'upcoming'
    },
    {
      id: '3',
      amount: 1200,
      dueDate: '2025-05-03',
      medication: 'Lisinopril 10mg',
      refillDays: 5,
      status: 'urgent'
    }
  ];

  const handlePayNow = (paymentId: string) => {
    toast({
      title: "Payment initiated",
      description: "You'll be redirected to the payment gateway shortly.",
    });
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Upcoming Payments</h1>
            <p className="text-muted-foreground">View your upcoming medication refill payments</p>
          </div>
          <WalletCards className="h-8 w-8 text-health-600" />
        </div>

        <div className="grid gap-4">
          {payments.map(payment => (
            <Card key={payment.id} className="transform transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-health-500">
              <CardHeader className="flex flex-row items-center justify-between py-4 bg-gradient-to-r from-health-100 to-transparent">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-health-600" />
                  <div className="flex items-center">
                    <IndianRupee className="h-3 w-3 mr-1" />
                    {payment.amount}
                  </div>
                </CardTitle>
                <Badge 
                  className={cn(
                    "px-4 py-1",
                    payment.refillDays <= 7 
                      ? "bg-red-100 text-red-800" 
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {payment.refillDays} days until refill
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Due Date:</span>
                    </div>
                    <span className="font-medium">{payment.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Medication:</span>
                    <span className="font-medium">{payment.medication}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Payment Options:</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> Cash
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> UPI
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> Card
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end">
                <Button
                  onClick={() => handlePayNow(payment.id)}
                  className="bg-health-600 hover:bg-health-700"
                >
                  Pay Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-health-50 p-6 rounded-lg border border-health-100">
          <h3 className="font-medium text-lg text-health-700">Payment Information</h3>
          <p className="text-sm text-gray-600 mt-2">
            You can pay for your medication refills using any of the following methods:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center text-sm">
              <IndianRupee className="h-4 w-4 mr-2 text-health-600" /> 
              Cash payment at the clinic
            </li>
            <li className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-health-600" /> 
              UPI payment using the HealthKart UPI ID: healthkart@upi
            </li>
            <li className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-health-600" /> 
              Credit/Debit card payment on delivery or online
            </li>
          </ul>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserPayments;
