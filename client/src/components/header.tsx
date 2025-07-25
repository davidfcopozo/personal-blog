"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
import { LanguageSwitcher } from "./ui/language-switcher";
import { useTheme } from "next-themes";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { PostType } from "@/typings/types";
import { useRouter } from "next/navigation";
import NotificationBell from "./notification-bell";
import { UserAvatar } from "./ui/user-avatar";

export function Header() {
  const t = useTranslations("navigation");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const { theme, systemTheme } = useTheme();
  const { data: session, status } = useSession();
  const [darkTheme, setDarkTheme] = useState("#000000");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();
  const { logout, currentUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const posts = queryClient.getQueryData(["posts"]) as { data: PostType[] };

  const handleSignout = async (e: FormEvent): Promise<any> => {
    e.preventDefault();
    try {
      await logout();
    } catch (error: Error | any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please try again.",
      });
    }
  };

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

  const filteredPosts = useMemo(() => {
    if (!posts?.data || !Array.isArray(posts.data)) {
      return [];
    }
    return posts?.data
      ?.filter((post: PostType) =>
        post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [posts, searchQuery]);

  return (
    <header className="fixed w-full top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <LogoIcon width="80 " height="80" color={darkTheme} />
        <span className="sr-only">TechyComm logo</span>
      </Link>
      <form className="ml-auto flex-auto relative lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="pl-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {filteredPosts &&
            filteredPosts?.length > 0 &&
            isFocused &&
            searchQuery && (
              <div className="absolute mt-4 bg-background rounded-md shadow-sm w-full">
                {filteredPosts?.map((post: PostType) => (
                  <Link
                    key={`${post._id}`}
                    href={`/blog/${post.slug}`}
                    className="block px-4 py-3 hover:bg-muted/50 hover:rounded-lg transition-colors"
                    prefetch={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseUp={() => router.push(`/blog/${post.slug}`)}
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            )}
        </div>
      </form>
      <nav className="ml-auto flex-col items-center gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {" "}
        <div className="flex text-sm gap-2 items-center md:gap-4 lg:gap-5">
          <LanguageSwitcher />
          <ModeToggle />
          {status === "authenticated" && <NotificationBell />}
        </div>
        {/*    {(session?.user as { accessToken?: string })?.accessToken !==
          undefined && (
          <div
            className={`
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
        )} */}
      </nav>

      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        {status === "unauthenticated" && (
          <Link
            href="/login"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {tAuth("signIn")}
          </Link>
        )}
        <DropdownMenu>
          {status === "unauthenticated" ? (
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-3xl"
            >
              <p className="text-xs md:text-sm font-bo  ">{tAuth("signUp")}</p>
              <span className="sr-only">{tAuth("signUp")}</span>
            </Link>
          ) : (
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full p-0 overflow-hidden"
              >
                <UserAvatar
                  user={currentUser?.data}
                  size="sm"
                  className="border-0"
                  isLoading={status === "loading"}
                />
                <span className="sr-only">{tCommon("toggleUserMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{tCommon("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">{t("profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">{t("dashboard")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">{t("settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => handleSignout(e)}>
              {tAuth("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
