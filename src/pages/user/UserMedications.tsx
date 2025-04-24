
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/components/user/UserLayout';
import { Pill, Clock } from 'lucide-react';

const UserMedications = () => {
  // Mock data for demonstration
  const medications = [
    {
      id: '1',
      name: 'Levothyroxine 88mcg',
      schedule: 'Once daily, morning',
      refillDate: 'Apr 28, 2025',
      status: 'active',
      daysRemaining: 4
    },
    {
      id: '2',
      name: 'Metformin 500mg',
      schedule: 'Twice daily with meals',
      refillDate: 'May 15, 2025',
      status: 'active',
      daysRemaining: 21
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Medications</h1>
          <p className="text-muted-foreground">Track your current medications and refills</p>
        </div>

        <div className="grid gap-4">
          {medications.map(medication => (
            <Card key={medication.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-health-500" />
                  <CardTitle className="text-lg font-medium">{medication.name}</CardTitle>
                </div>
                <Badge variant="outline">{medication.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{medication.schedule}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Next Refill:</span> {medication.refillDate}
                    <span className="ml-2 text-health-600">({medication.daysRemaining} days left)</span>
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

export default UserMedications;
