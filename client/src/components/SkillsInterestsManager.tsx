"use client";
import React, { FormEvent, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import useFetchRequest from "@/hooks/useFetchRequest";
import {
  SingleInterestType,
  SingleSkillType,
  SkillsInterestsProps,
} from "@/typings/types";
import { useTranslations } from "next-intl";

const SkillsInterestsManager = <
  T extends SingleSkillType | SingleInterestType
>({
  items,
  setItems,
  label,
  placeholder,
  fetchUrl,
}: SkillsInterestsProps<T>) => {
  const t = useTranslations("settings");
  const { data: categoriesOrTopicsOrTopics } = useFetchRequest(
    [fetchUrl],
    `/api/${fetchUrl}`
  );
  const [availableItems, setAvailableItems] = useState<T[]>([]);
  const [itemsSearchQuery, setItemsSearchQuery] = useState("");
  const [isItemsInputFocused, setIsItemsInputFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [newItem, setNewItem] = useState<T | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (
      newItem &&
      items &&
      !items.some((item) => item._id.toString() === newItem._id.toString())
    ) {
      setItems([...items, newItem as unknown as T]);
      setAvailableItems((prevAvailableItems) =>
        prevAvailableItems.filter(
          (availableItem) => availableItem._id !== (newItem as T)._id
        )
      );
      setNewItem(null);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    // Refocus the input field when clicking inside the results to avoid window blur
    inputRef.current?.focus();
  };

  const selectItem = (item: T) => {
    setItems([...(items || []), item]);
    setAvailableItems((prevAvailableItems) =>
      prevAvailableItems.filter(
        (availableItem) => availableItem._id.toString() !== item._id.toString()
      )
    );
    setItemsSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(
      (items || []).filter((item: T) => item._id.toString() !== itemToRemove)
    );
    setAvailableItems([
      ...(availableItems.filter(
        (item): item is T => item !== undefined
      ) as T[]),
      (items || []).find((item) => item._id.toString() === itemToRemove) as T,
    ]);
  };

  const handleClickOutside = (e: globalThis.MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsItemsInputFocused(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (isItemsInputFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isItemsInputFocused]);

  const filteredItems = useMemo(() => {
    if (
      !categoriesOrTopicsOrTopics?.data ||
      !Array.isArray(categoriesOrTopicsOrTopics.data)
    ) {
      return [];
    }
    return categoriesOrTopicsOrTopics.data.filter((item: T) =>
      item.name.toLowerCase().includes(itemsSearchQuery.toLowerCase())
    );
  }, [categoriesOrTopicsOrTopics, itemsSearchQuery]);

  useEffect(() => {
    setAvailableItems(filteredItems);
  }, [filteredItems]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (highlightedIndex === availableItems.length - 1) {
        setHighlightedIndex(-1);
      }
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, availableItems.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      if (highlightedIndex === -1 || highlightedIndex === 0) {
        setHighlightedIndex(availableItems.length);
      }
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectItem(availableItems[highlightedIndex]);
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
        <Label className="font-bold text-md ">{label}</Label>
        <div className="flex flex-wrap gap-2 my-2">
          {Array.isArray(items) &&
            items?.map((item: T) => (
              <Badge
                key={`${item._id}`}
                variant="secondary"
                className="text-sm px-4 py-2"
                aria-label={`${item.name}`}
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item._id.toString())}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              ref={inputRef}
              value={itemsSearchQuery}
              onChange={(e) => setItemsSearchQuery(e.target.value)}
              onFocus={() => setIsItemsInputFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
            {availableItems?.length > 0 &&
              isItemsInputFocused &&
              itemsSearchQuery && (
                <div
                  ref={resultsRef}
                  onMouseDown={handleMouseDown}
                  id="results"
                  className="absolute z-30 max-h-40 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full mt-2 bg-background rounded-md shadow-sm"
                >
                  {availableItems?.map((item: T, index: number) => (
                    <div
                      key={`${item._id}`}
                      onClick={() => selectItem(item)}
                      className={`px-4 py-2 cursor-pointer hover:bg-muted-foreground hover:text-background ${
                        highlightedIndex === index &&
                        "bg-foreground text-background"
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <Button type="submit" variant="outline" onClick={handleAddItem}>
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillsInterestsManager;
