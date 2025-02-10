'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { track } from '@vercel/analytics';

export function TestFixturesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateFixtures = async () => {
    setIsLoading(true);
    track('fixtures_update_started');
    
    try {
      const response = await fetch('/api/test-fixtures?update=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update fixtures');
      }

      track('fixtures_update_success', {
        totalFixtures: data.summary.totalFixtures,
        fixturesByRound: Object.keys(data.summary.fixturesByRound || {}).length
      });

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
      track('fixtures_update_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
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
      {isLoading ? 'Updating Fixtures...' : 'Update Fixtures'}
    </Button>
  );
} 