'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function TestFixturesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateFixtures = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-fixtures?update=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update fixtures');
      }

      toast({
        title: 'Fixtures Update Successful',
        description: (
          <div className="mt-2 text-sm">
            <p>Total Fixtures: {data.summary.totalFixtures}</p>
            <p>Sample Match: {data.summary.sampleFixtures[0]?.match}</p>
            <p className="mt-1 text-muted-foreground">
              Google Sheet has been updated with the latest fixtures
            </p>
          </div>
        ),
        duration: 5000,
      });

      console.log('Update Results:', data);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update fixtures',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={updateFixtures}
      disabled={isLoading}
      variant="gradient"
      className="w-full font-semibold py-3"
    >
      {isLoading ? 'Updating Fixtures...' : 'Update Football Fixtures'}
    </Button>
  );
} 