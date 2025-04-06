
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    condition: string;
    nextRefill: string;
    daysRemaining: number;
    phone: string;
  };
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const isUrgent = patient.daysRemaining <= 3;
  const isWarning = patient.daysRemaining <= 7 && patient.daysRemaining > 3;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{patient.name}</CardTitle>
          <Badge 
            className={cn(
              isUrgent ? "bg-red-100 text-red-800 hover:bg-red-100" : 
              isWarning ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
              "bg-green-100 text-green-800 hover:bg-green-100"
            )}
          >
            {isUrgent ? 'Urgent' : isWarning ? 'Soon' : 'Ok'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex justify-between">
            <span>Age:</span>
            <span className="font-medium text-gray-700">{patient.age} years</span>
          </div>
          <div className="flex justify-between">
            <span>Condition:</span>
            <span className="font-medium text-gray-700">{patient.condition}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Next Refill:</span>
            <span className="font-medium text-gray-700">{patient.nextRefill}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> Contact:</span>
            <span className="font-medium text-gray-700">{patient.phone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <div className={cn(
            "text-xs font-medium",
            isUrgent ? "text-red-600" : isWarning ? "text-yellow-600" : "text-green-600"
          )}>
            {patient.daysRemaining} days remaining
          </div>
          <Link to={`/patients/${patient.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
