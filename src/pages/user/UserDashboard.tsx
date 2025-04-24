import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Calendar, Clock, CreditCard, Phone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import UserLayout from '@/components/user/UserLayout';

const UserDashboard = () => {
  const userEmail = localStorage.getItem('authEmail');
  const userName = localStorage.getItem('userName') || userEmail?.split('@')[0] || 'User';

  const userData = {
    name: 'Priya Sharma',
    phone: '(834) 567-8901',
    address: '456 Nehru Avenue, Delhi, DL 110001',
    nextRefill: 'Apr 28, 2025',
    daysRemaining: 4
  };

  const medications = [
    { name: 'Levothyroxine 88mcg', schedule: 'Once daily, morning', refillDate: 'Apr 28, 2025' },
    { name: 'Metformin 500mg', schedule: 'Twice daily with meals', refillDate: 'May 15, 2025' }
  ];

  const upcomingDeliveries = [
    { medication: 'Levothyroxine 88mcg', date: 'Apr 29, 2025', status: 'Scheduled' }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hello, {userName}</h1>
          <p className="text-muted-foreground">
            Welcome to your personal medication portal
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Medication Refill</CardTitle>
              <Clock className="h-4 w-4 text-health-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.nextRefill}</div>
              <p className="text-xs text-muted-foreground">
                {userData.daysRemaining} days remaining
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Refill progress</span>
                  <span>{100 - (userData.daysRemaining * 3.33)}%</span>
                </div>
                <Progress value={100 - (userData.daysRemaining * 3.33)} className="h-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-health-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medications.length}</div>
              <p className="text-xs text-muted-foreground">Current prescriptions</p>
              <Button variant="outline" className="w-full mt-4" size="sm">View Details</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Doctor</CardTitle>
              <Phone className="h-4 w-4 text-health-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">Dr. Rajiv Mehta</div>
              <p className="text-xs text-muted-foreground">Endocrinologist</p>
              <Button className="w-full mt-4" size="sm">Call Now</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Your active prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {medication.schedule}
                    </div>
                    <div className="text-sm text-health-600">
                      Next refill: {medication.refillDate}
                    </div>
                    <hr className="my-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deliveries</CardTitle>
              <CardDescription>Status of your medication orders</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingDeliveries.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeliveries.map((delivery, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{delivery.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          Delivery date: {delivery.date}
                        </p>
                      </div>
                      <div className="rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                        {delivery.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No upcoming deliveries</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
