'use client';

import { useState } from 'react';
import { fetchAPI } from '@/lib/api';
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

export default function AddFeedForm({ userId }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      feedUrl: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const { error: apiError } = await fetchAPI('/api/feeds/subscribe', {
      body: { feedUrl: data.feedUrl, userId }
    });

    if (apiError) {
      form.setError('feedUrl', { message: apiError });
    } else {
      form.reset();
      window.location.reload();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Add New Feed</h2>
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