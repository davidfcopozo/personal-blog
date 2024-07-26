import { MouseEvent, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Javascript" },
    { id: 2, name: "Node JS" },
    { id: 3, name: "Next.js" },
    { id: 4, name: "React" },
    { id: 5, name: "TailwindCSS" },
    { id: 6, name: "CSS" },
    { id: 7, name: "HTML" },
    { id: 8, name: "Express" },
  ]);
  const [showMore, setShowMore] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const handleAddCategory = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newCategory.trim() !== "") {
      setCategories([
        { id: categories.length + 1, name: newCategory.trim() },
        ...categories,
      ]);
      setNewCategory("");
    }
  };
  const handleCategoryClick = (
    e: MouseEvent<HTMLButtonElement>,
    category: { id: number; name: string }
  ) => {
    e.preventDefault();
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {categories
            .slice(0, showMore ? categories.length : 5)
            .map((category: any) => (
              <Button
                key={category.id}
                variant={
                  selectedCategories.includes(category.id)
                    ? "default"
                    : "outline"
                }
                className="flex items-center gap-2 font-normal cursor-pointer justify-start"
                onClick={(e) => handleCategoryClick(e, category)}
              >
                {category.name}
              </Button>
            ))}
          {categories.length > 5 && (
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "See Less" : "See More"}
            </Button>
          )}
        </div>
        <div className="mt-4 grid gap-2">
          <div className="grid grid-col gap-2 lg:items-center lg:gap-2 lg:grid lg:grid-cols-[1fr_auto]">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={(e) => handleAddCategory(e)}>Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Categories;
