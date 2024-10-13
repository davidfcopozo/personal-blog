import { MouseEvent, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { CategoryInterface } from "@/typings/interfaces";
import useFetchRequest from "@/hooks/useFetchRequest";
import { Skeleton } from "./ui/skeleton";

const Categories = () => {
  const {
    data: fetchCategories,
    isLoading,
    isFetching,
    error,
  } = useFetchRequest("categories", "/api/categories");
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryInterface[]
  >([]);
  const [showMore, setShowMore] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryInterface | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryInterface[]
  >([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [amountOfCategories, setAmountOfCategories] = useState(0);

  const showMoreCategories = () => {
    setShowMore(true);
    setAmountOfCategories(
      (prevAmountOfCategories) => prevAmountOfCategories + 5
    );
  };
  const showLessCategories = () => {
    setAmountOfCategories(
      (prevAmountOfCategories) => prevAmountOfCategories - 5
    );
  };

  const handleAddCategory = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory(null);
    }
  };

  const selectCategory = (category: CategoryInterface) => {
    setCategories([...categories, category]);
    setAvailableCategories((prevAvailableCategories) =>
      prevAvailableCategories.filter(
        (availableCategory) => availableCategory._id !== category._id
      )
    );
    setCategorySearchQuery("");
    /* setHighlightedIndex(-1); */
  };

  const handleCategoryClick = (
    e: MouseEvent<HTMLButtonElement>,
    category: CategoryInterface
  ) => {
    e.preventDefault();
    if (selectedCategories.some((c) => c._id === category._id)) {
      return; // Avoid duplicate selection
    }
    setSelectedCategories([...selectedCategories, category]);
    setAvailableCategories((prevAvailableCategories) =>
      prevAvailableCategories.filter(
        (availableCategory) => availableCategory._id !== category._id
      )
    );
  };

  useEffect(() => {
    if (fetchCategories?.data && Array.isArray(fetchCategories.data)) {
      setAvailableCategories(fetchCategories.data);
    }
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (categorySearchQuery === "") {
      return availableCategories;
    }
    return availableCategories.filter((category) =>
      category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [availableCategories, categorySearchQuery]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {isFetching || isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="max-w-full h-[15px]" />
              <Skeleton className="max-w-full h-[15px]" />
              <Skeleton className="max-w-full h-[15px]" />
            </div>
          ) : (
            availableCategories &&
            availableCategories
              .slice(0, showMore ? amountOfCategories : 5)
              .map((category: CategoryInterface) => (
                <Button
                  key={`${category._id}`}
                  variant={
                    selectedCategories.filter(
                      (selectedCategory) =>
                        selectedCategory._id === category._id
                    ).length > 0
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2 font-normal cursor-pointer justify-start w-content px-2"
                  onClick={(e) => handleCategoryClick(e, category)}
                >
                  {category.name}
                </Button>
              ))
          )}
          {availableCategories && availableCategories.length > 5 && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={showMoreCategories}
              >
                See More
              </Button>
              {amountOfCategories > 5 && (
                <Button
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={showLessCategories}
                >
                  See Less
                </Button>
              )}
            </>
          )}
        </div>
        <div className="mt-4 grid gap-2">
          <div className="relative grid grid-col gap-2 lg:items-center lg:gap-2 lg:grid lg:grid-cols-[1fr_auto]">
            <Input
              placeholder="Add new category"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              /* onChange={(e) => handleAddCategory(e)} */
            />
            <Button onClick={(e) => handleAddCategory(e)}>Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Categories;
