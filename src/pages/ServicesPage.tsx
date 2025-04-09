import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog
import { load } from "@tauri-apps/plugin-store";
import { AddServiceForm } from "@/components/AddServiceForm";
import { Link } from "react-router-dom";
import { Service } from "@/types";
import { toast } from "sonner";

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const reloadData = useCallback(async () => {
    try {
      const store = await load("store.json", { autoSave: false });
      const val = await store.get<Service[]>("services");
      setServices(val || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      toast.error("Load Failed", { description: "Could not load services." });
      setServices([]);
    }
  }, []);

  useEffect(() => {
    // Explicitly ignore the promise with void
    void reloadData();
  }, [reloadData]);

  // Callback for AddServiceForm to close dialog
  const handleServiceAdded = () => {
    // Explicitly ignore the promise with void
    void reloadData();
    setIsAddServiceDialogOpen(false);
  };

  // Function to open the delete confirmation dialog
  const openDeleteDialog = (serviceName: string) => {
    setServiceToDelete(serviceName);
    setIsAlertOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    const serviceIdentifier = serviceToDelete;
    try {
      const store = await load("store.json", { autoSave: true });
      const currentServices = (await store.get<Service[]>("services")) || [];

      const updatedServices = currentServices.filter(
        (service) => service.name !== serviceIdentifier
      );

      await store.set("services", updatedServices);
      await store.delete(`api_keys_${serviceIdentifier}`);
      await store.save();

      setServices(updatedServices);
      toast.success("Service Deleted", {
        description: `Service ${serviceIdentifier} and its keys have been deleted.`,
      });
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Delete Failed", {
        description: "Could not delete the service.",
      });
    } finally {
      setIsAlertOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <main className="flex flex-col w-screen justify-center">
      <ul className="flex flex-col mt-5">
        {services?.map((service) => (
          <li
            key={service.name}
            className="flex flex-row justify-between items-center m-5 border p-5 rounded-md"
          >
            <p className="text-xl mr-4">{service.name}</p>
            <div className="flex items-center gap-2">
              <Link to="/api_key" state={{ service: service }}>
                <Button size="sm">Expand</Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700"
                onClick={() => openDeleteDialog(service.name)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={isAddServiceDialogOpen}
        onOpenChange={setIsAddServiceDialogOpen}
      >
        <DialogTrigger className="w-full p-5 focus:outline-none focus:ring-0">
          <Button variant="outline" className="w-full">
            Add new API Service
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AddServiceForm onServiceAdded={handleServiceAdded} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service <span className="font-semibold">{serviceToDelete}</span>{" "}
              and all associated API keys.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void confirmDeleteService();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default ServicesPage;
