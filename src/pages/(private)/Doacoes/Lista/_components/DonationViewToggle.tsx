import { Grid, CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DonationViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onNewDonation: () => void;
}

export function DonationViewToggle({ view, onViewChange, onNewDonation }: DonationViewToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex border rounded-lg overflow-hidden">
        <Button 
          variant={view === 'grid' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onViewChange('grid')}
          className="rounded-none border-r"
        >
          <Grid className="h-4 w-4 mr-2" />
          Grid
        </Button>
        <Button 
          variant={view === 'list' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onViewChange('list')}
          className="rounded-none"
        >
          Lista
        </Button>
      </div>
      
      <Button onClick={onNewDonation} className="ml-auto">
        <CirclePlus className="h-4 w-4 mr-2" />
        Nova Doação
      </Button>
    </div>
  );
}
