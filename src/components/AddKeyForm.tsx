import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiKey } from "@/types"; // Import ApiKey type
import { load } from "@tauri-apps/plugin-store";
import { toast } from "sonner"; // Import toast for notifications

// Update Zod schema to match ApiKey type
const formSchema = z.object({
  key: z.string().min(1, { message: "API Key cannot be empty." }),
  is_rate_limited: z.boolean(), // Remove .default(false) here
  rate_limit_time: z.coerce // Coerce input to number
    .number({ invalid_type_error: "Rate limit must be a number." })
    .int({ message: "Rate limit must be a whole number of hours." })
    .positive({ message: "Rate limit must be positive." })
    .min(1, { message: "Rate limit must be at least 1 hour." }),
});

// Define props interface
interface AddKeyFormProps {
  onKeyAdded: () => void;
  serviceName: string; // Keep serviceName prop
}

// Removed inline api_keys interface

export function AddKeyForm({ onKeyAdded, serviceName }: AddKeyFormProps) {
  // Use the updated schema for form validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Default values match the schema (rate_limit_time is number)
    defaultValues: {
      key: "",
      is_rate_limited: false,
      rate_limit_time: 1, // Default to 1 hour
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const storeKey = `api_keys_${serviceName}`;
    try {
      const store = await load("store.json", { autoSave: true });

      // Use ApiKey type here
      const currentKeys = (await store.get<ApiKey[]>(storeKey)) || [];

      // Check for duplicate key
      if (currentKeys.some((k) => k.key === values.key)) {
        toast.error("Duplicate API Key", {
          description: "This API key already exists for this service.",
        });
        return; // Stop submission
      }

      // Construct the new ApiKey object, including rateLimitedAt
      const newApiKey: ApiKey = {
        ...values,
        // Set rateLimitedAt based on form input
        rateLimitedAt: values.is_rate_limited ? Date.now() : null,
      };

      const updatedKeys = [...currentKeys, newApiKey];

      await store.set(storeKey, updatedKeys);
      // store.save() might not be needed if autoSave is true, but can be kept for safety
      await store.save();

      toast.success("API Key Added", {
        description: `Key ${values.key} added to ${serviceName}.`,
      });

      onKeyAdded(); // Call callback to refresh parent state & close dialog
      form.reset(); // Reset form fields
    } catch (error) {
      console.error("Failed to save key:", error);
      toast.error("Save Failed", {
        description:
          error instanceof Error ? error.message : "Could not save API key.",
      });
    }
  }

  // Wrapper function to handle the promise correctly
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    void form.handleSubmit(onSubmit)(); // Call handleSubmit and ignore the returned promise with void
  };

  return (
    <Form {...form}>
      {/* Use the wrapper function here */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API KEY</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The API key to add.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add FormField for is_rate_limited */}
        <FormField
          control={form.control}
          name="is_rate_limited"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is Rate Limited?</FormLabel>
                <FormDescription>
                  Check if this key is currently rate limited.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add FormField for rate_limit_time */}
        <FormField
          control={form.control}
          name="rate_limit_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Limit Time (Hours)</FormLabel>{" "}
              {/* Update label */}
              <FormControl>
                {/* Change input type to number */}
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g., 24"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify the rate limit duration in hours.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
