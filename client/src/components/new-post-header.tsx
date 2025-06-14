"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { LogoIcon } from "./ui/icons";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NewPostHeaderProps } from "@/typings/interfaces";

export function NewPostHeader({ onSave }: NewPostHeaderProps) {
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
        <Button
          variant="outline"
          className="bg-background"
          onClick={handleSaveDraft}
          size="sm"
        >
          Save Draft
        </Button>
        <Button className="bg-foreground" size="sm" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </header>
  );
}
