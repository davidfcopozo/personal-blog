"use client";
import { KeyboardEvent, SyntheticEvent, useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export default function Tags({ setTags, tags }: TagsProps) {
  const t = useTranslations("editor");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    if (tags && tags.length > 0) {
      setAddedTags(tags);
    }
  }, [tags]);

  const handleAddTag = (e: SyntheticEvent) => {
    e.preventDefault();
    if (newTag.trim() === "") return;

    if (addedTags.includes(newTag.trim())) {
      toast({
        variant: "destructive",
        title: tCommon("error"),
        description: t("tagAlreadyAdded"),
      });
      return;
    }

    setAddedTags((prevTags) => [...prevTags, newTag.trim()]);
    setTags((prevTags) => [...prevTags, newTag.trim()]);
    setNewTag("");
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = addedTags.filter((_, i) => i !== index);
    setAddedTags(updatedTags);
    setTags(updatedTags);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tags")}</CardTitle>
        <CardDescription>{t("addTagsToPost")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-col gap-2 lg:items-center lg:gap-2 lg:grid lg:grid-cols-[1fr_auto]">
          <Input
            type="text"
            placeholder={t("addTag")}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button onClick={(e) => handleAddTag(e)}>{t("add")}</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {addedTags.map((tag, index) => (
            <CustomBadge
              uniQueKey={index}
              value={tag}
              onRemove={() => handleRemoveTag(index)}
              key={index}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
