
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserLayout from '@/components/user/UserLayout';
import { Bell, Calendar } from 'lucide-react';

const UserReminders = () => {
  // Mock data for demonstration
  const reminders = [
    {
      id: '1',
      medication: 'Levothyroxine 88mcg',
      time: '8:00 AM',
      date: 'Daily',
      status: 'upcoming'
    },
    {
      id: '2',
      medication: 'Metformin 500mg',
      time: '9:00 AM, 9:00 PM',
      date: 'Daily',
      status: 'upcoming'
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Reminders</h1>
          <p className="text-muted-foreground">Manage your medication reminders</p>
        </div>

        <div className="grid gap-4">
          {reminders.map(reminder => (
            <Card key={reminder.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-health-500" />
                  <CardTitle className="text-lg font-medium">{reminder.medication}</CardTitle>
                </div>
                <Badge variant="outline">{reminder.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{reminder.date}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Time:</span> {reminder.time}
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

export default UserReminders;
