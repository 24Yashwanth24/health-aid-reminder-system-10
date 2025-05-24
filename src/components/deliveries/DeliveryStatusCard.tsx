
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Package, User, Clock } from 'lucide-react';

interface DeliveryStatusCardProps {
  delivery: {
    id: string;
    patientName: string;
    medication: string;
    address: string;
    deliveryDate: string;
    status: string;
    paymentStatus: string;
    paymentAmount: number;
  };
  onStatusUpdate: (id: string, status: string) => void;
}

const DeliveryStatusCard = ({ delivery, onStatusUpdate }: DeliveryStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'in-transit':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case 'scheduled':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'failed':
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return "Delivered";
      case 'in-transit':
        return "In Transit";
      case 'scheduled':
        return "Scheduled";
      case 'failed':
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'scheduled':
        return 'in-transit';
      case 'in-transit':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus(delivery.status);
    if (nextStatus !== delivery.status) {
      onStatusUpdate(delivery.id, nextStatus);
    }
  };

  const handlePaymentStatusUpdate = () => {
    // Toggle payment status between paid and pending
    const newPaymentStatus = delivery.paymentStatus === 'paid' ? 'pending' : 'paid';
    // For now, we'll just update the delivery status since we don't have a separate payment update handler
    console.log('Payment status update:', newPaymentStatus);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{delivery.medication}</CardTitle>
          <Badge className={getStatusColor(delivery.status)}>
            {getStatusText(delivery.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <User className="h-4 w-4 mt-0.5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">{delivery.patientName}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">{delivery.address}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Clock className="h-4 w-4 mt-0.5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Delivery Date: {delivery.deliveryDate}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <div 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              delivery.paymentStatus === 'paid' 
                ? "bg-green-100 text-green-800" 
                : delivery.paymentStatus === 'pending'
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {delivery.paymentStatus === 'paid' 
              ? 'Paid' 
              : delivery.paymentStatus === 'pending'
              ? 'Pending'
              : 'Failed'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePaymentStatusUpdate}
        >
          {delivery.paymentStatus === 'paid' ? 'Mark as Pending' : 'Mark as Paid'}
        </Button>
        
        <Button 
          size="sm"
          onClick={handleUpdateStatus}
          disabled={delivery.status === 'delivered'}
        >
          {delivery.status === 'delivered' 
            ? 'Delivered' 
            : `Mark as ${getStatusText(getNextStatus(delivery.status))}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryStatusCard;
