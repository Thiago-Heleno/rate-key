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
} from "@/components/ui/alert-dialog";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import { writeText } from "@tauri-apps/plugin-clipboard-manager"; // Use plugin
import { load } from "@tauri-apps/plugin-store";
import { AddKeyForm } from "@/components/AddKeyForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiKey, Service } from "@/types";

// Helper function remains the same
function formatRemainingTime(milliseconds: number): string {
  if (milliseconds <= 0) {
    return "Ready";
  }
  return formatDistanceToNowStrict(Date.now() + milliseconds, {
    addSuffix: true,
  });
}

function ApiKeyPage() {
  const location = useLocation();
  // Add type assertion for location.state
  const { service } = (location.state as { service?: Service }) || {
    service: undefined,
  };

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now()); // State to trigger re-renders for timer

  const storeKey = service ? `api_keys_${service.name}` : null;

  // Fetch initial data
  const reloadData = useCallback(async () => {
    if (!storeKey) return;
    try {
      const store = await load("store.json", { autoSave: false });
      const val = await store.get<ApiKey[]>(storeKey);
      setApiKeys(val || []);
    } catch (error) {
      console.error("Failed to load keys:", error);
      toast.error("Load Failed", { description: "Could not load API keys." });
      setApiKeys([]);
    }
  }, [storeKey]);

  useEffect(() => {
    // Explicitly ignore the promise with void
    void reloadData();
  }, [reloadData]);

  // Effect to update 'now' state every second for the timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000); // Update every second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Callback for AddKeyForm
  const handleKeyAdded = () => {
    // Explicitly ignore the promise with void
    void reloadData();
    setIsAddKeyDialogOpen(false);
  };

  // Handler for toggling rate limit - Modified Reset Logic
  const handleRateLimitToggle = async (keyToToggle: string) => {
    if (!storeKey || !apiKeys) return;
    let keyChanged = false;
    const updatedKeys = apiKeys.map((apiKey) => {
      if (apiKey.key === keyToToggle) {
        const now = Date.now();

        // If currently rate limited, allow reset regardless of time
        if (apiKey.is_rate_limited) {
          keyChanged = true;
          return {
            ...apiKey,
            is_rate_limited: false, // Resetting
            rateLimitedAt: null,
          };
        } else {
          // If not currently limited, apply the limit
          keyChanged = true;
          return {
            ...apiKey,
            is_rate_limited: true, // Applying limit
            rateLimitedAt: now,
          };
        }
      }
      return apiKey;
    });

    if (!keyChanged) return; // No change occurred

    try {
      const store = await load("store.json", { autoSave: true });
      await store.set(storeKey, updatedKeys);
      await store.save();
      setApiKeys(updatedKeys);
      toast.success("Rate Limit Status Updated", {
        description: `Key ${keyToToggle} status changed.`,
      });
    } catch (error) {
      console.error("Failed to update rate limit status:", error);
      toast.error("Update Failed", {
        description: "Could not update rate limit status.",
      });
    }
  };

  // Function to open the delete confirmation dialog
  const openDeleteDialog = (key: string) => {
    setKeyToDelete(key);
    setIsAlertOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const confirmDeleteKey = async () => {
    if (!storeKey || !apiKeys || !keyToDelete) return;
    const keyIdentifier = keyToDelete;
    const updatedKeys = apiKeys.filter(
      (apiKey) => apiKey.key !== keyIdentifier
    );
    try {
      const store = await load("store.json", { autoSave: true });
      await store.set(storeKey, updatedKeys);
      await store.save();
      setApiKeys(updatedKeys);
      toast.success("API Key Deleted", {
        description: `Key ${keyIdentifier} has been deleted.`,
      });
    } catch (error) {
      console.error("Failed to delete key:", error);
      toast.error("Delete Failed", {
        description: "Could not delete the API key.",
      });
    } finally {
      setIsAlertOpen(false);
      setKeyToDelete(null);
    }
  };

  // Handler for copying an API key
  const handleCopyKey = async (keyToCopy: string) => {
    try {
      await writeText(keyToCopy);
      toast.success("Key Copied!", {
        description: "API key copied to clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy key:", error);
      toast.error("Copy Failed", {
        description: "Could not copy key to clipboard.",
      });
    }
  };

  // Handler for getting a random working key
  const handleGetRandomKey = async () => {
    if (!storeKey || !apiKeys || apiKeys.length === 0) {
      toast.info("No API Keys", {
        description: "No keys available for this service.",
      });
      return;
    }
    const workingKeys = apiKeys.filter((apiKey) => {
      if (!apiKey.is_rate_limited || !apiKey.rateLimitedAt) return true;
      const endTime = apiKey.rateLimitedAt + apiKey.rate_limit_time * 3600000;
      return Date.now() >= endTime;
    });
    if (workingKeys.length === 0) {
      toast.warning("No Working Keys", {
        description: "All keys for this service are currently rate-limited.",
      });
      return;
    }
    const randomIndex = Math.floor(Math.random() * workingKeys.length);
    const selectedKey = workingKeys[randomIndex];
    try {
      await writeText(selectedKey.key);
      toast.success("Key Copied!", {
        description: `Key ${selectedKey.key} copied to clipboard.`,
      });
      await handleRateLimitToggle(selectedKey.key);
    } catch (error) {
      console.error("Failed to copy key or apply rate limit:", error);
      toast.error("Operation Failed", {
        description: "Could not copy key or apply rate limit.",
      });
    }
  };

  if (!service) {
    return <main className="p-5 text-center">Service data not found.</main>;
  }

  return (
    <main className="flex flex-col w-screen justify-center">
      <p className="text-center w-full p-5">{service.name}</p>
      <ul className="flex flex-col">
        <ScrollArea className="h-80">
          {apiKeys?.map((apiKey) => (
            <li
              key={apiKey.key}
              className="flex flex-row justify-between m-5 border p-5 rounded-md"
            >
              <div className="flex-1 overflow-hidden mr-4">
                {/* Mask the API key display */}
                <p className="text-xl font-mono break-all">
                  {apiKey.key.substring(0, 4)}********************
                </p>
                {apiKey.is_rate_limited && apiKey.rateLimitedAt ? (
                  (() => {
                    // Use the 'now' state variable for consistent time checking
                    const endTime =
                      apiKey.rateLimitedAt + apiKey.rate_limit_time * 3600000;
                    const remainingMs = endTime - now;
                    return (
                      <p
                        className={`text-sm ${
                          remainingMs > 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {remainingMs > 0
                          ? `Rate Limited (Wait ${formatRemainingTime(
                              remainingMs
                            )})`
                          : "Rate Limit Ended (Ready)"}
                      </p>
                    );
                  })()
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Not Rate Limited
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-start gap-2">
                <Button
                  size="sm"
                  variant={apiKey.is_rate_limited ? "destructive" : "secondary"}
                  // Wrap async call
                  onClick={() => {
                    void handleRateLimitToggle(apiKey.key);
                  }}
                >
                  {apiKey.is_rate_limited ? "Reset Limit" : "Rate Limit"}
                </Button>
                {/* Attach handleCopyKey */}
                <Button
                  size="sm"
                  variant="outline"
                  // Wrap async call
                  onClick={() => {
                    void handleCopyKey(apiKey.key);
                  }}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => openDeleteDialog(apiKey.key)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ScrollArea>
      </ul>
      <div className="p-5">
        <Button
          className="w-full"
          onClick={() => {
            void handleGetRandomKey();
          }}
        >
          Get a random working key
        </Button>
      </div>

      <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
        <DialogTrigger asChild className="w-full">
          <div className="p-5">
            <Button variant="outline" className="w-full">
              Add new API KEY
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <AddKeyForm onKeyAdded={handleKeyAdded} serviceName={service.name} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API
              key: <br />
              <span className="font-mono break-all font-semibold">
                {keyToDelete}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKeyToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void confirmDeleteKey();
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

export default ApiKeyPage;
