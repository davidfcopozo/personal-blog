import { BlogCard } from "@/components/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container p-2 mx-auto">
      <div className="flex flex-row flex-wrap p-2 sm:p-4">
        <main
          role="main"
          className="w-full flex justify-center flex-wrap gap-4 mt-14 sm:w-2/3 md:w-3/4 pt-1 px-2"
        >
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </main>
        <aside className="w-full hidden pt-12 sm:flex sm:flex-column sm:w-1/3 md:w-1/4 px-2 border-l-2 border-secondary">
          <div className="sticky top-16 p-4 bg-background rounded-xl w-full h-[84vh]">
            <div>
              <div className="flex ml-auto flex-col gap-8">
                <form className="ml-auto flex-1 sm:flex-start">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 ml-2 h-5 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search posts..."
                      className="rounded-full pl-10 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                </form>
                <div className="flex ml-2 flex-col">
                  <p className="text-sm text-foreground font-semibold mb-4">
                    What do you want to read about?
                  </p>
                  <div className="flex flex-wrap gap-3 text-middle text-accent font-semibold text-background">
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      <p>CSS</p>
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Javascript
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Node Js
                    </Link>
                    <Link
                      href="/#"
                      className="bg-card-foreground py-[0.1em] rounded-xl justify-center px-3 transition-all duration-300 hover:scale-105"
                    >
                      Next.Js
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-7 ml-2 text-muted-foreground text-xs">
                <Link href="/#">Home</Link>
                <Link href="/#">Terms</Link>
                <Link href="/#">About</Link>
                <Link href="/#">Privacy</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
