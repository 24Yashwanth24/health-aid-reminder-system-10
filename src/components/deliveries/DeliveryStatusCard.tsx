
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
    status: 'pending' | 'processing' | 'in_transit' | 'delivered';
    paymentStatus: 'paid' | 'unpaid' | 'processing';
  };
  onStatusChange: (id: string, status: string) => void;
  onPaymentStatusChange: (id: string, status: string) => void;
}

const DeliveryStatusCard = ({ delivery, onStatusChange, onPaymentStatusChange }: DeliveryStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'in_transit':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case 'processing':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'pending':
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return "Delivered";
      case 'in_transit':
        return "In Transit";
      case 'processing':
        return "Processing";
      case 'pending':
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'in_transit';
      case 'in_transit':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus(delivery.status);
    if (nextStatus !== delivery.status) {
      onStatusChange(delivery.id, nextStatus);
    }
  };

  const togglePaymentStatus = () => {
    // If current status is 'processing', change to 'paid', otherwise toggle between 'paid' and 'unpaid'
    let newStatus = 'paid';
    if (delivery.paymentStatus === 'paid') {
      newStatus = 'unpaid';
    } else if (delivery.paymentStatus === 'unpaid') {
      newStatus = 'paid';
    }
    onPaymentStatusChange(delivery.id, newStatus);
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
                : delivery.paymentStatus === 'processing'
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {delivery.paymentStatus === 'paid' 
              ? 'Paid' 
              : delivery.paymentStatus === 'processing'
              ? 'Processing'
              : 'Unpaid'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={togglePaymentStatus}
        >
          {delivery.paymentStatus === 'paid' 
            ? 'Mark as Unpaid' 
            : delivery.paymentStatus === 'processing'
            ? 'Mark as Paid' 
            : 'Mark as Paid'}
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
