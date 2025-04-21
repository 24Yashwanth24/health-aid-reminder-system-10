
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Pill, Truck, CreditCard, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  // Mock data
  const stats = {
    patients: 128,
    activeReminders: 24,
    upcomingRefills: 17,
    pendingDeliveries: 8,
    pendingPayments: 12,
  };

  const recentReminders = [
    { id: '1', name: 'Rajesh Kumar', medication: 'Metformin 500mg', daysLeft: 2 },
    { id: '2', name: 'Priya Sharma', medication: 'Synthroid 88mcg', daysLeft: 3 },
    { id: '3', name: 'Vikram Singh', medication: 'Lisinopril 10mg', daysLeft: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to HealthKart Express Reminder System
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/patients" className="w-full">
              <Button variant="outline" className="w-full" size="sm">View All</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
            <Bell className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReminders}</div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-1" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/reminders" className="w-full">
              <Button variant="outline" className="w-full" size="sm">Manage</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Refills</CardTitle>
            <Calendar className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingRefills}</div>
            <p className="text-xs text-muted-foreground">In the next 14 days</p>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/reminders" className="w-full">
              <Button variant="outline" className="w-full" size="sm">View Schedule</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
            <Pill className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Types in the system</p>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/medications" className="w-full">
              <Button variant="outline" className="w-full" size="sm">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/deliveries" className="w-full">
              <Button variant="outline" className="w-full" size="sm">Process</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-health-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting collection</p>
          </CardContent>
          <CardFooter className="p-2">
            <Link to="/payments" className="w-full">
              <Button variant="outline" className="w-full" size="sm">Process</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent refill reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Refill Reminders</CardTitle>
            <CardDescription>Patients requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReminders.map(reminder => (
                <div key={reminder.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{reminder.name}</p>
                    <p className="text-sm text-muted-foreground">{reminder.medication}</p>
                  </div>
                  <div className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    reminder.daysLeft <= 3 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {reminder.daysLeft} days left
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Link to="/reminders" className="w-full">View All Reminders</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for the day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" /> Add New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" /> Send Reminder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Truck className="mr-2 h-4 w-4" /> Schedule Delivery
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" /> Process Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
