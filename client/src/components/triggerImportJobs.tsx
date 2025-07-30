// src/components/TriggerImportButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { triggerImport } from '@/lib/api'; // Adjust path
import { useToast } from '@/hooks/useToast'; // Assuming you have shadcn/ui toast setup

export default function TriggerImportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTrigger = async () => {
    setIsLoading(true);
    try {
      const response = await triggerImport();
      toast({
        title: 'Import Triggered',
        description: response.message,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Failed to trigger import:', error);
      toast({
        title: 'Import Failed',
        description: error.response?.data?.message || 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleTrigger} disabled={isLoading} className="w-full sm:w-auto">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Triggering...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Trigger New Import
        </>
      )}
    </Button>
  );
}