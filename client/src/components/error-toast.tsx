"use client";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function ToastDestructive({ message }: { message: string | null }) {
  const { toast } = useToast();

  useEffect(() => {
    if (!message) return;
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: message,
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }, [message]);

  return null;
}
