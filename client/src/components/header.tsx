"use client";
import Link from "next/link";
import { CircleUser, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "./ui/icons";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, systemTheme } = useTheme();

  let isDarkTheme =
    theme === "system" && systemTheme === "dark"
      ? "#ffffff"
      : theme === "system" && systemTheme === "light"
      ? "#000000"
      : theme === "light"
      ? "#000000"
      : theme === "light"
      ? "#000000"
      : "#ffffff";

  return (
    <header className="fixed w-full justify-between top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <LogoIcon width="80 " height="80" color={isDarkTheme} />
        <span className="sr-only">TechyComm logo</span>
      </Link>
      <form className="ml-auto flex-1 md:flex-initial md:hidden">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
      </form>
      <nav className="ml-auto flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-end md:gap-5 md:text-sm lg:gap-6">
        <div className="flex text-sm gap-2 items-center md:gap-4 lg:gap-5">
          {/*       <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Write
          </Link> */}

          <ModeToggle />
        </div>
        <div
          className={`${
            true ? "md:hidden" : "md:hidden"
          } hidden md:flex md:gap-5 lg:gap-6`}
        >
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Analytics
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign In
        </Link>
        {/*           <form className="ml-auto flex-1 flex-initial md:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form> */}
        <DropdownMenu>
          {true ? (
            <Button variant="default" size="sm" className="rounded-3xl">
              <p className="text-xs md:text-sm font-bold">Sign Up</p>
              <span className="sr-only">Sign up button</span>
            </Button>
          ) : (
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
