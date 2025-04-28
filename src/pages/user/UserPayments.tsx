
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/components/user/UserLayout';
import { CircleDollarSign, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserPayments = () => {
  const userEmail = localStorage.getItem('authEmail');
  const userName = localStorage.getItem('userName');

  // Mock data for demonstration
  const payments = [
    {
      id: '1',
      amount: 1500,
      dueDate: '2025-05-10',
      medication: 'Levothyroxine 88mcg',
      refillDays: 12
    },
    {
      id: '2',
      amount: 2500,
      dueDate: '2025-05-15',
      medication: 'Metformin 500mg',
      refillDays: 17
    }
  ];

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
            <Card key={payment.id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between py-4 bg-gradient-to-r from-health-100 to-transparent">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-health-600" />
                  ₹{payment.amount}
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span>{payment.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Medication:</span>
                    <span>{payment.medication}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserPayments;
