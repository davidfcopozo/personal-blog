import useFetchRequest from "@/hooks/useFetchRequest";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { InterestFormProps } from "@/typings/types";

const InterestForm = ({ interests, setInterests }: InterestFormProps) => {
  const { data: topics } = useFetchRequest("topics", "/api/topics");
  const [newInterest, setNewInterest] = useState("");
  const [availableInterests, setAvailableInterests] = useState<any[]>([]);
  const [interestSearchQuery, setInterestSearchQuery] = useState("");
  const [isInterestsInputFocused, setIsInterestsInputFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddInterest = (e: FormEvent) => {
    e.preventDefault();
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    // Refocus the input field when clicking inside the results to avoid window blur
    inputRef.current?.focus();
  };

  const selectInterest = (interest: any) => {
    setInterests([...interests, interest]);
    setAvailableInterests((prevAvailableInterests) =>
      prevAvailableInterests.filter(
        (availableInterest) => availableInterest._id !== interest._id
      )
    );
    setInterestSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(
      interests.filter(
        (interest: any) => interest._id.toString() !== interestToRemove
      )
    );
    setAvailableInterests([
      ...availableInterests,
      interests.find(
        (interest) => interest._id.toString() === interestToRemove
      ),
    ]);
  };

  const handleClickOutside = (e: globalThis.MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsInterestsInputFocused(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (isInterestsInputFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInterestsInputFocused]);

  const filteredInterests = useMemo(() => {
    if (!topics?.data || !Array.isArray(topics.data)) {
      return [];
    }
    return topics.data.filter((interest: any) =>
      interest.name.toLowerCase().includes(interestSearchQuery.toLowerCase())
    );
  }, [topics, interestSearchQuery]);

  useEffect(() => {
    setAvailableInterests(filteredInterests);
  }, [filteredInterests]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, availableInterests.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectInterest(availableInterests[highlightedIndex]);
    }
  };
  useEffect(() => {
    // Auto-scroll the results when navigating with the keyboard
    if (
      resultsRef.current &&
      highlightedIndex >= 0 &&
      resultsRef.current.children[highlightedIndex]
    ) {
      const highlightedOption = resultsRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      highlightedOption.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="font-bold">Topics of interest</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {Array.isArray(interests) &&
            interests?.map((interest: any) => (
              <Badge
                key={interest._id}
                variant="secondary"
                className="text-sm px-4"
              >
                {interest.name}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest._id.toString())}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>
        <div /* onSubmit={handleAddInterest} */ className="flex gap-2">
          <div className="relative w-full">
            <Input
              ref={inputRef}
              value={interestSearchQuery}
              onChange={(e) => setInterestSearchQuery(e.target.value)}
              onFocus={() => setIsInterestsInputFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for topics of interest"
            />
            {availableInterests?.length > 0 &&
              isInterestsInputFocused &&
              interestSearchQuery && (
                <div
                  ref={resultsRef}
                  onMouseDown={handleMouseDown}
                  id="results"
                  className="absolute max-h-40 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full mt-2 bg-background rounded-md shadow-sm"
                >
                  {availableInterests?.map((interest: any, index: number) => (
                    <div
                      key={`${interest._id}`}
                      onClick={() => selectInterest(interest)}
                      className={`px-4 py-2 cursor-pointer hover:bg-muted-foreground hover:text-background ${
                        highlightedIndex === index &&
                        "bg-foreground text-background"
                      }`}
                    >
                      {interest.name}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <Button type="button" onClick={handleAddInterest} variant="outline">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestForm;
