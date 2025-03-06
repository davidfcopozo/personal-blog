import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, SortAsc } from "lucide-react";
import { ImageInterface } from "@/typings/interfaces";

interface SearchAndFilterProps {
  images: ImageInterface[];
  onSearch?: (query: string) => void;
}

export function SearchAndFilter({ images, onSearch }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    images.forEach((image) => {
      image.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [images]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
    if (onSearch) {
      onSearch(newSearchQuery);
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSort = (newSortBy: "date" | "name") => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="mb-4 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter and sort controls */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[20%] ">
                <Label htmlFor="tag-filter" className="pl-2">
                  Filter by tag
                </Label>
                <select
                  id="tag-filter"
                  value={selectedTags.join(",")}
                  onChange={(e) => setSelectedTags(e.target.value.split(","))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <Button
              onClick={() => toggleSort("date")}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                sortBy === "date"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <SortAsc
                className={`w-4 h-4 ${
                  sortBy === "date" && sortOrder === "desc" ? "rotate-180" : ""
                }`}
              />
              Date
            </Button>
            <Button
              onClick={() => toggleSort("name")}
              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                sortBy === "name"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <SortAsc
                className={`w-4 h-4 ${
                  sortBy === "name" && sortOrder === "desc" ? "rotate-180" : ""
                }`}
              />
              Name
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
