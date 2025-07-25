import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ImageInterface } from "@/typings/interfaces";
import { useTranslations } from "next-intl";

interface EditableImagePropertiesProps {
  image: ImageInterface;
  onUpdate: (id: string, updates: Partial<ImageInterface>) => void;
}

export function EditableImageProperties({
  image,
  onUpdate,
}: EditableImagePropertiesProps) {
  const t = useTranslations("settings");
  const [title, setTitle] = useState(image.title || "");
  const [altText, setAltText] = useState(image.altText || "");
  const [tags, setTags] = useState<string[]>(image.tags || []);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setTitle(image.title || "");
    setAltText(image.altText || "");
    setTags(image.tags || []);
  }, [image.title, image.altText, image.tags, image._id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(image._id, { title, altText, tags });
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg">{t("editableProperties")}</h3>

      <div className="space-y-2">
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("enterDescriptiveTitle")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altText">{t("altText")}</Label>
        <Input
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder={t("describeImageAccessibility")}
        />
        <div className="space-y-2">
          <Label htmlFor="tags">{t("tags")}</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("addTag")}
              className="flex-grow"
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              {t("add")}
            </Button>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {t("saveChanges")}
      </Button>
    </form>
  );
}
