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
import { storage } from '@/firebase/firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { CreateAuction } from '@/contracthooks/Auction';
import { useNavigate } from 'react-router-dom';
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
  min_eth: z.number().min(0, {
    message: 'Minimum price should be at least 0 ETH.',
  }),
  cover_image: fileSchema,
  add_images: fileSchema.optional(),

});

export function AuctionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    },
  });
  const auctionId = nanoid();

  const fileUpload = async (auctionId, file) => {
    if (!file) return null;
    const storageRef = ref(storage, `auctions/${auctionId}/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMsg('Error uploading file');
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const AuctionDeploy = await CreateAuction(data.min_eth, auctionId);
      if (AuctionDeploy.success) {
        toast({
          title: 'Auction contract deployed successfully',
          status: 'success',
        });
      } else {
        toast({
          title: 'Error deploying auction contract',
          status: 'error',
        });
        return;
      }
      setLoading(true);
      setError(false);
      setErrorMsg('');
      const owner_address = address;

      const coverImageUrl = await fileUpload(auctionId, data.cover_image[0]);

      const additionalImageUrls = data.add_images
        ? await Promise.all(
            Array.from(data.add_images).map((file) =>
              fileUpload(auctionId, file)
            )
          )
        : [];
      let min_eth = data.min_eth ? data.min_eth : 0;
      const auctionData = {
        auctionname: data.auctionname,
        auctionId,
        address: owner_address,
        auctionproduct: data.auctionproduct,
        description: data.description,
        min_eth: min_eth,
        cover_image: coverImageUrl,
        add_images: additionalImageUrls,
         start_of_auction: new Date() ,
      };

      const response = await axios.post(
        '/create-auction',
        auctionData
      );
      if (response.status === 201) {
        setError(false);
        setErrorMsg('');
        setLoading(false);
        form.reset();
        toast({
          title: 'Auction created successfully',
        });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMsg('Failed to upload the data.');
      setLoading(false);
    }
  };

  const handleFileChange = (event, field) => {
    const files = event.target.files;
    try {
      fileSchema.parse(files);
      field.onChange(files);
    } catch (error) {
      setErrorMsg(error.errors[0].message);
      setError(true);
    }
  };

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    //     <FormField
    //       control={form.control}
    //       name="auctionname"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>AuctionName</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Auction Name" {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="auctionproduct"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Product For Auction</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Auction Product" {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="description"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Describe the product</FormLabel>
    //           <FormControl>
    //             <Textarea
    //               placeholder="Describe"
    //               className="resize-y min-h-[30vh]"
    //               {...field}
    //             />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="min_eth"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Minimum Product Value</FormLabel>
    //           <FormControl>
    //             <Input
    //               type="number"
    //               {...field}
    //               onChange={(e) => field.onChange(parseFloat(e.target.value))}
    //             />
    //           </FormControl>
    //           <FormDescription>
    //             the min amount should be paid while registering the product
    //           </FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="cover_image"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Cover Image</FormLabel>
    //           <FormControl>
    //             <Input
    //               type="file"
    //               accept="image/jpeg, image/png"
    //               onChange={(e) => handleFileChange(e, field)}
    //             />
    //           </FormControl>
    //           <FormDescription>Accepted types: jpg, jpeg, png</FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="add_images"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Additional Images</FormLabel>
    //           <FormControl>
    //             <Input
    //               type="file"
    //               multiple
    //               accept="image/jpeg, image/png"
    //               onChange={(e) => handleFileChange(e, field)}
    //             />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="start_of_auction"
    //       render={({ field }) => (
    //         <FormItem className="flex flex-col">
    //           <FormLabel>Start of Auction</FormLabel>
    //           <Popover>
    //             <PopoverTrigger asChild>
    //               <FormControl>
    //                 <Button
    //                   variant={'outline'}
    //                   className={cn(
    //                     'w-[240px] pl-3 text-left font-normal',
    //                     !field.value && 'text-muted-foreground'
    //                   )}
    //                 >
    //                   {field.value ? (
    //                     format(field.value, 'PPP')
    //                   ) : (
    //                     <span>Pick a date</span>
    //                   )}
    //                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
    //                 </Button>
    //               </FormControl>
    //             </PopoverTrigger>
    //             <PopoverContent className="w-auto p-0" align="start">
    //               <Calendar
    //                 mode="single"
    //                 selected={field.value}
    //                 onSelect={field.onChange}
    //                 disabled={(date) => date < new Date() + 1}
    //                 initialFocus
    //               />
    //             </PopoverContent>
    //           </Popover>
    //           <FormDescription>
    //             Auction can be only scheduled for future
    //           </FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <Button type="submit" disabled={isLoading}>
    //       {isLoading ? 'Submitting...' : 'Submit'}
    //     </Button>
    //     {isError && <p className="text-red-500">{error}</p>}
    //   </form>
    // </Form>




    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Auction</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Auction Name */}
          <FormField
            control={form.control}
            name="auctionname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auction Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter auction name" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Auction Product */}
          <FormField
            control={form.control}
            name="auctionproduct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product for Auction</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the product" className="resize-y min-h-[90px] input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Minimum Product Value */}
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
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  The minimum amount should be paid while registering the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image Upload */}
          <FormField
            control={form.control}
            name="cover_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, field)} />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">Accepted formats: JPG, PNG</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Images Upload */}
          <FormField
            control={form.control}
            name="add_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Images</FormLabel>
                <FormControl>
                  <Input type="file" multiple accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, field)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start of Auction */}
          {/* <FormField
            control={form.control}
            name="start_of_auction"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start of Auction</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg flex justify-between items-center text-gray-700 bg-gray-50 hover:bg-gray-100",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-sm text-gray-500">The auction must be scheduled for a future date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Auction"}
          </Button>

          {/* Error Message */}
          {isError && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </Form>
    </div>
  );
}
