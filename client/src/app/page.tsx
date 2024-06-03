import { BlogCard } from "@/components/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="container p-2 mx-auto">
      <div className="flex flex-row flex-wrap p-2 sm:p-4">
        <main
          role="main"
          className="w-full flex justify-center flex-wrap gap-4 mt-12 sm:w-2/3 md:w-3/4 pt-1 px-2"
        >
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </main>
        <aside className="w-full hidden pt-12 sm:flex sm:flex-column sm:w-1/3 md:w-1/4 px-2 border-l-2 border-secondary">
          <div className="sticky top-16 p-4 bg-background rounded-xl w-full h-[84vh]">
            <form className="ml-auto flex-1 sm:flex-start">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
