import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import LogoutButton from '@/components/auth/LogoutButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  UsersRound,
  CalendarClock,
  Bell,
  ArrowRight,
  Pill,
  CreditCard,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    urgentRefills: 0,
    upcomingRefills: 0,
    pendingPayments: 0,
    recentPatients: [] as any[],
    upcomingRefillPatients: [] as any[]
  });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (patientsError) {
        throw patientsError;
      }

      // Process data for dashboard
      const today = new Date();
      const urgentRefills = patientsData.filter(patient => 
        differenceInDays(new Date(patient.next_refill_date), today) <= 3
      ).length;
      
      const upcomingRefills = patientsData.filter(patient => {
        const days = differenceInDays(new Date(patient.next_refill_date), today);
        return days > 3 && days <= 7;
      }).length;
      
      const pendingPayments = patientsData.filter(patient => 
        patient.payment_status === 'pending' || patient.payment_status === 'unpaid'
      ).length;
      
      // Get recent patients
      const recentPatients = patientsData.slice(0, 5).map(patient => ({
        id: patient.id,
        name: patient.name,
        condition: patient.condition,
        date: format(new Date(patient.created_at), 'MMM dd, yyyy')
      }));
      
      // Get upcoming refill patients
      const upcomingRefillPatients = patientsData
        .filter(patient => differenceInDays(new Date(patient.next_refill_date), today) > 0)
        .sort((a, b) => 
          new Date(a.next_refill_date).getTime() - new Date(b.next_refill_date).getTime()
        )
        .slice(0, 5)
        .map(patient => ({
          id: patient.id,
          name: patient.name,
          medication: patient.medication,
          refillDate: format(new Date(patient.next_refill_date), 'MMM dd, yyyy'),
          daysRemaining: differenceInDays(new Date(patient.next_refill_date), today)
        }));
      
      setDashboardData({
        totalPatients: patientsData.length,
        urgentRefills,
        upcomingRefills,
        pendingPayments,
        recentPatients,
        upcomingRefillPatients
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Could not fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('patients-changes-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your pharmacy management dashboard</p>
        </div>
        <LogoutButton />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Registered in the system
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Refills</CardTitle>
                <CalendarClock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardData.urgentRefills}</div>
                <p className="text-xs text-red-600">
                  Due within 3 days
                </p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Refills</CardTitle>
                <Bell className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{dashboardData.upcomingRefills}</div>
                <p className="text-xs text-yellow-600">
                  Due within 4-7 days
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardData.pendingPayments}</div>
                <p className="text-xs text-blue-600">
                  To be collected
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Recent Patients</CardTitle>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/patients">
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {dashboardData.recentPatients.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No patients added yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.condition || 'No condition specified'}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{patient.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Upcoming Refills</CardTitle>
                  <Button size="sm" variant="ghost" asChild>
                    <a href="/reminders">
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {dashboardData.upcomingRefillPatients.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming refills
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.upcomingRefillPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Pill className="h-3 w-3 mr-1" />
                            {patient.medication || 'No medication specified'}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-right">{patient.refillDate}</p>
                          <p className={`text-right ${
                            patient.daysRemaining <= 3 
                              ? 'text-red-600' 
                              : patient.daysRemaining <= 7 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                          }`}>
                            {patient.daysRemaining} days left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="flex justify-between bg-green-100 hover:bg-green-200 text-green-800" variant="ghost" asChild>
                  <a href="/patients">
                    <span>Add New Patient</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button className="flex justify-between bg-blue-100 hover:bg-blue-200 text-blue-800" variant="ghost" asChild>
                  <a href="/reminders">
                    <span>Send Reminders</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button className="flex justify-between bg-purple-100 hover:bg-purple-200 text-purple-800" variant="ghost" asChild>
                  <a href="/payments">
                    <span>Process Payments</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
