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
// Checkbox import is not needed here
import { Service } from "@/types"; // Import Service type
import { load } from "@tauri-apps/plugin-store";
import { toast } from "sonner"; // Import toast

// Update Zod schema for service name validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Service name cannot be empty." }),
});

// Rename props interface and callback
interface AddServiceFormProps {
  onServiceAdded: () => void; // Callback function
}

// Removed inline interface definitions

export function AddServiceForm({ onServiceAdded }: AddServiceFormProps) {
  // Use renamed prop
  // Use updated schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const store = await load("store.json", { autoSave: true });

      // Use Service type
      const currentServices = (await store.get<Service[]>("services")) || [];

      // Check for duplicate service name (case-insensitive check)
      if (
        currentServices.some(
          (s) => s.name.toLowerCase() === values.name.toLowerCase()
        )
      ) {
        toast.error("Duplicate Service", {
          description: `A service named '${values.name}' already exists.`,
        });
        return; // Stop submission
      }

      // Create a new Service object with empty api_keys array
      const newService: Service = {
        name: values.name,
        api_keys: [], // Initialize with empty keys
      };

      const updatedServices = [...currentServices, newService];

      await store.set("services", updatedServices);
      await store.save(); // Ensure save completes

      toast.success("Service Added", {
        description: `Service '${values.name}' has been added.`,
      });

      onServiceAdded(); // Call renamed callback
      form.reset(); // Reset form
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error("Save Failed", {
        description:
          error instanceof Error ? error.message : "Could not save service.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Service Name</FormLabel> {/* Updated Label */}
              <FormControl>
                <Input placeholder="e.g., OpenAI, GitHub" {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the new API service.
              </FormDescription>{" "}
              {/* Updated Desc */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
