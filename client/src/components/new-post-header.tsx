"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoIcon } from "./ui/icons";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NewPostHeaderProps } from "@/typings/interfaces";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export function NewPostHeader({
  onSave,
  currentStatus,
  hasChanges = false,
  isSaving = false,
}: NewPostHeaderProps) {
  const { theme, systemTheme } = useTheme();
  const { data: session } = useSession();
  const [darkTheme, setDarkTheme] = useState("#000000");

  useEffect(() => {
    setDarkTheme(
      theme === "dark"
        ? "#ffffff"
        : theme === "light"
        ? "#000000"
        : systemTheme === "dark"
        ? "#ffffff"
        : "#000000"
    );
  }, [theme, systemTheme, session]);
  const handleSaveDraft = () => {
    onSave("draft");
  };

  const handlePublish = () => {
    onSave("published");
  };

  const handleUnpublish = () => {
    onSave("unpublished");
  };

  const isPublished = currentStatus === "published";

  return (
    <header className="fixed w-full justify-between top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <LogoIcon width="80 " height="80" color={darkTheme} />
        <span className="sr-only">TechyComm logo</span>
      </Link>
      <nav className="ml-auto flex-col items-center gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="flex text-sm gap-2 items-center md:gap-4 lg:gap-5">
          <ModeToggle />
        </div>
      </nav>{" "}
      <div className="flex gap-2">
        {" "}
        <Button
          variant="outline"
          className="bg-background relative"
          onClick={handleSaveDraft}
          size="sm"
          disabled={isSaving}
        >
          {hasChanges && !isSaving && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          )}
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>{" "}
        {isPublished ? (
          hasChanges && !isSaving ? (
            // If published and has changes, show Update button
            <Button
              className="bg-foreground"
              size="sm"
              onClick={handlePublish}
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Update"}
            </Button>
          ) : (
            // If published and no changes, show dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-foreground" size="sm" disabled={isSaving}>
                  <Eye className="w-4 h-4 mr-1" />
                  Published
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUnpublish}>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Unpublish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <Button
            className="bg-foreground"
            size="sm"
            onClick={handlePublish}
            disabled={isSaving}
          >
            {isSaving ? "Publishing..." : "Publish"}
          </Button>
        )}
      </div>
    </header>
  );
}
