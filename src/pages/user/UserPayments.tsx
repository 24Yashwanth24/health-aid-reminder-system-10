
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/components/user/UserLayout';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

const UserPayments = () => {
  const userEmail = localStorage.getItem('authEmail');

  // Mock data for demonstration
  const payments = [
    {
      id: '1',
      amount: 1500,
      status: 'pending',
      date: '2025-04-20',
      medication: 'Levothyroxine 88mcg'
    },
    {
      id: '2',
      amount: 2500,
      status: 'paid',
      date: '2025-04-19',
      medication: 'Metformin 500mg'
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Payments</h1>
          <p className="text-muted-foreground">View and manage your payment history</p>
        </div>

        <div className="grid gap-4">
          {payments.map(payment => (
            <Card key={payment.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg font-medium">₹{payment.amount}</CardTitle>
                <Badge className={payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {payment.status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Date:</span> {payment.date}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Medication:</span> {payment.medication}
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
