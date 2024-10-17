"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CustomBadge from "./custom-badge";
import { TagsProps } from "@/typings/types";

export default function Tags({ setTags }: TagsProps) {
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (newTag.trim() !== "") {
      setAddedTags([...addedTags, newTag.trim()]);
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...addedTags];
    updatedTags.splice(index, 1);
    setAddedTags(updatedTags);
    setTags((prevTags) => {
      const updatedTags = [...prevTags];
      updatedTags.splice(index, 1);
      return updatedTags;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag(e);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>Add tags to your post</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-col gap-2 lg:items-center lg:gap-2 lg:grid lg:grid-cols-[1fr_auto]">
          <Input
            type="text"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={(e) => handleAddTag(e)}>Add</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {addedTags.map((tag, index) => (
            <CustomBadge
              uniQueKey={index}
              value={tag}
              onRemove={() => handleRemoveTag(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
