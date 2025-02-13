'use client';

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function AddFeedForm({ userId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      feedUrl: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/feeds/${userId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedUrl: data.feedUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      form.reset();
      if (onSuccess) {
        onSuccess();
      }
      window.location.reload();
    } catch (error) {
      form.setError('feedUrl', { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="feedUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Enter RSS feed URL"
                    disabled={isLoading}
                    required
                    className="bg-muted"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Feed'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 