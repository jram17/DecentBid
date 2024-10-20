'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Zod schema and regex for validation
const _regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\W]+$/i;
const fileSchema = z
  .instanceof(FileList)
  .refine((files) => files.length > 0, 'At least one file is required.')
  .refine(
    (files) => files.length <= 3,
    'A maximum of three files can be provided.'
  )
  .refine(
    (files) =>
      Array.from(files).every((file) =>
        ['image/jpeg', 'image/png'].includes(file.type)
      ),
    'Only jpg and png images are accepted.'
  );

const formSchema = z.object({
  auctionname: z
    .string()
    .min(6, {
      message: 'Auction product should be at least 6 letters long.',
    })
    .regex(_regex, 'This is not a valid name'),
  auctionproduct: z
    .string()
    .min(6, {
      message: 'Auction product should be at least 6 letters long.',
    })
    .regex(_regex, 'This is not a valid name'),
  description: z
    .string()
    .min(20, {
      message: 'Description should be at least 20 characters long.',
    })
    .regex(_regex, 'This is not a valid description'),
  min_eth: z.number().min(0.05, {
    message: 'Minimum price should be at least 0.05 ETH.',
  }),
  cover_image: fileSchema,
  add_images: fileSchema.optional(),
  start_of_auction: z
    .date({
      required_error: 'Start date is required.',
    })
    .refine((date) => {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      const year = new Date();
      year.setFullYear(year.getFullYear() + 1);
      return date >= now && date < year;
    }, 'The start of auction must be at least one day in the future.'),
});

export function AuctionForm() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const address = useSelector((state) => state.address.address);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auctionname: '',
      auctionproduct: '',
      description: '',
      min_eth: 0,
      start_of_auction: null,
    },
  });

  const fileUpload = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const auctionId = nanoid();
      const owner_address = address;
      console.log('cme here');
      console.log(data);
      const coverImageUrl = await fileUpload(data.cover_image[0]);
      console.log(coverImageUrl);
      // Upload additional images (if any)
      // const additionalImageUrls = await Promise.all(
      //   data.add_images
      //     ? Array.from(data.add_images).map((file) => {
      //         return fileUpload(file);
      //       })
      //     : []
      // );

      const auctionData = {
        auctionId,
        owner_address,
        auctionproduct: data.auctionproduct,
        description: data.description,
        min_eth: data.min_eth,
        cover_image: coverImageUrl,
        add_images: additionalImageUrls,
        start_of_auction: data.start_of_auction,
      };

      console.log(auctionData);
      // Handle your API call or any other action here
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMsg('Failed to upload files or submit the form.');
      setLoading(false);
    }
  };

  const handleFileChange = (event, field) => {
    const files = event.target.files;
    try {
      fileSchema.parse(files); // Validate files with Zod
      field.onChange(files);
    } catch (error) {
      setErrorMsg(error.errors[0].message);
      setError(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="auctionname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AuctionName</FormLabel>
              <FormControl>
                <Input placeholder="Auction Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auctionproduct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product For Auction</FormLabel>
              <FormControl>
                <Input placeholder="Auction Product" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe the product</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe"
                  className="resize-y min-h-[30vh]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="min_eth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Product Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                This much amount should be paid while registering the product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileChange(e, field)}
                />
              </FormControl>
              <FormDescription>Accepted types: jpg, jpeg, png</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="add_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileChange(e, field)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_of_auction"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start of Auction</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() + 1}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Auction can be scheduled for future
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        {isError && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
}
