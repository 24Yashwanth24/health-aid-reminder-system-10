
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddMedicationFormProps {
  onAddComplete: () => void;
  onCancel: () => void;
}

const AddMedicationForm = ({ onAddComplete, onCancel }: AddMedicationFormProps) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [schedule, setSchedule] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate adding medication
    setTimeout(() => {
      toast({
        title: "Medication added",
        description: `${medicationName} has been added to your medications.`,
      });
      setIsLoading(false);
      onAddComplete();
    }, 800);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Add New Medication</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="medication-name" className="block text-sm font-medium text-gray-700 mb-1">
            Medication Name
          </label>
          <Input
            id="medication-name"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            placeholder="e.g. Levothyroxine"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
            Dosage
          </label>
          <Input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 50mg"
            required
          />
        </div>
        
        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
            Schedule
          </label>
          <Input
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. Morning, before breakfast"
            required
          />
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="as_needed">As needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Medication'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicationForm;
