
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  patientName: string;
  medication: string;
  refillDate: string;
  daysRemaining: number;
  status: 'pending' | 'sent' | 'contacted' | 'completed';
  contactNumber: string;
}

interface ReminderListProps {
  reminders: Reminder[];
  onStatusChange: (id: string, status: Reminder['status']) => void;
}

const ReminderList = ({ reminders, onStatusChange }: ReminderListProps) => {
  const { toast } = useToast();

  const handleCall = (patientName: string, contactNumber: string) => {
    toast({
      title: `Calling ${patientName}`,
      description: `Dialing ${contactNumber}...`,
    });
  };

  const getStatusColor = (status: Reminder['status'], daysRemaining: number) => {
    if (status === 'completed') return "bg-green-100 text-green-800 hover:bg-green-100";
    if (status === 'contacted') return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    if (status === 'sent') return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    
    // For pending status
    if (daysRemaining <= 3) return "bg-red-100 text-red-800 hover:bg-red-100";
    if (daysRemaining <= 7) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  const getStatusText = (status: Reminder['status'], daysRemaining: number) => {
    if (status === 'completed') return "Completed";
    if (status === 'contacted') return "Contacted";
    if (status === 'sent') return "Reminder Sent";
    
    // For pending status
    if (daysRemaining <= 3) return "Urgent";
    if (daysRemaining <= 7) return "Soon";
    return "Pending";
  };

  const markAsContacted = (id: string) => {
    onStatusChange(id, 'contacted');
    toast({
      title: "Reminder Updated",
      description: "Patient has been marked as contacted.",
    });
  };

  const markAsCompleted = (id: string) => {
    onStatusChange(id, 'completed');
    toast({
      title: "Reminder Completed",
      description: "Patient has confirmed the medication refill.",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Refill Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell className="font-medium">{reminder.patientName}</TableCell>
              <TableCell>{reminder.medication}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{reminder.refillDate}</span>
                  <span className={cn(
                    "text-xs",
                    reminder.daysRemaining <= 3 ? "text-red-600" :
                    reminder.daysRemaining <= 7 ? "text-yellow-600" : "text-gray-600"
                  )}>
                    {reminder.daysRemaining} days left
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(reminder.status, reminder.daysRemaining)}>
                  {getStatusText(reminder.status, reminder.daysRemaining)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleCall(reminder.patientName, reminder.contactNumber)}
                    title="Call Patient"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => markAsContacted(reminder.id)}
                    disabled={reminder.status === 'contacted' || reminder.status === 'completed'}
                    title="Mark as Contacted"
                    className={reminder.status === 'contacted' ? "bg-blue-50" : ""}
                  >
                    <Phone className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => markAsCompleted(reminder.id)}
                    disabled={reminder.status === 'completed'}
                    title="Mark as Completed"
                    className={reminder.status === 'completed' ? "bg-green-50" : ""}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReminderList;
