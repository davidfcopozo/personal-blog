"use client";
import React, { FormEvent, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import useFetchRequest from "@/hooks/useFetchRequest";
import { SingleSkillType, SkillsFormProps } from "@/typings/types";

const SkillsForm = ({ skills, setSkills }: SkillsFormProps) => {
  const { data: categories } = useFetchRequest("categories", "/api/categories");
  const [availableSkills, setAvailableSkills] = useState<SingleSkillType[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [isSkillsInputFocused, setIsSkillsInputFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [newSkill, setNewSkill] = useState<SingleSkillType | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (
      newSkill &&
      skills &&
      !skills.some((skill) => skill._id === newSkill._id)
    ) {
      setSkills([...skills, newSkill]);
      setAvailableSkills((prevAvailableSkills) =>
        prevAvailableSkills.filter(
          (availableSkill) =>
            availableSkill._id !== (newSkill as SingleSkillType)._id
        )
      );
      setNewSkill(null);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    // Refocus the input field when clicking inside the results to avoid window blur
    inputRef.current?.focus();
  };

  const selectSkill = (skill: SingleSkillType) => {
    setSkills([...skills, skill]);
    setAvailableSkills((prevAvailableSkills) =>
      prevAvailableSkills.filter(
        (availableSkill) => availableSkill._id !== skill._id
      )
    );
    setSkillSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(
      skills.filter(
        (skill: SingleSkillType) => skill._id.toString() !== skillToRemove
      )
    );
    setAvailableSkills([
      ...(availableSkills.filter(
        (skill): skill is SingleSkillType => skill !== undefined
      ) as SingleSkillType[]),
      skills.find(
        (skill) => skill._id.toString() === skillToRemove
      ) as SingleSkillType,
    ]);
  };

  const handleClickOutside = (e: globalThis.MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsSkillsInputFocused(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (isSkillsInputFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSkillsInputFocused]);

  const filteredSkills = useMemo(() => {
    if (!categories?.data || !Array.isArray(categories.data)) {
      return [];
    }
    return categories.data.filter((skill: SingleSkillType) =>
      skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
    );
  }, [categories, skillSearchQuery]);

  useEffect(() => {
    setAvailableSkills(filteredSkills);
  }, [filteredSkills]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (highlightedIndex === availableSkills.length - 1) {
        setHighlightedIndex(-1);
      }
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, availableSkills.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      if (highlightedIndex === -1 || highlightedIndex === 0) {
        setHighlightedIndex(availableSkills.length);
      }
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectSkill(availableSkills[highlightedIndex]);
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
        <Label className="font-bold">Skills</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {Array.isArray(skills) &&
            skills?.map((skill: any) => (
              <Badge
                key={skill._id}
                variant="secondary"
                className="text-sm px-4"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill._id.toString())}
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
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              onFocus={() => setIsSkillsInputFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for skills"
            />
            {availableSkills?.length > 0 &&
              isSkillsInputFocused &&
              skillSearchQuery && (
                <div
                  ref={resultsRef}
                  onMouseDown={handleMouseDown}
                  id="results"
                  className="absolute z-30 max-h-40 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full mt-2 bg-background rounded-md shadow-sm"
                >
                  {availableSkills?.map((skill: any, index: number) => (
                    <div
                      key={`${skill._id}`}
                      onClick={() => selectSkill(skill)}
                      className={`px-4 py-2 cursor-pointer hover:bg-muted-foreground hover:text-background ${
                        highlightedIndex === index &&
                        "bg-foreground text-background"
                      }`}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <Button type="submit" variant="outline" onClick={handleAddSkill}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
