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

export default function Tags() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
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
        <CardDescription>Add tags to your product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
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
          {tags.map((tag, index) => (
            <CustomBadge
              key={index}
              value={tag}
              onRemove={() => handleRemoveTag(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
