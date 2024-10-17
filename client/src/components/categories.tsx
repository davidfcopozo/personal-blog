import { MouseEvent, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { CategoryInterface } from "@/typings/interfaces";
import useFetchRequest from "@/hooks/useFetchRequest";
import { Skeleton } from "./ui/skeleton";
import { XIcon } from "./icons";

const Categories = () => {
  const {
    data: fetchCategories,
    isLoading,
    isFetching,
    error,
  } = useFetchRequest("categories", "/api/categories");
  const [availableCategories, setAvailableCategories] = useState<
    CategoryInterface[]
  >([]);
  const [showMore, setShowMore] = useState(false);
  const [newCategories, setNewCategories] = useState<
    CategoryInterface[] | null
  >(null);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryInterface[]
  >([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [amountOfCategories, setAmountOfCategories] = useState(5);
  const [initialCategories, setInitialCategories] = useState<
    CategoryInterface[]
  >([]);

  const showMoreCategories = () => {
    setShowMore(true);
    setAmountOfCategories(
      (prevAmountOfCategories) => prevAmountOfCategories + 5
    );
  };

  const showLessCategories = () => {
    setAmountOfCategories((prevAmountOfCategories) =>
      Math.max(prevAmountOfCategories - 5, 5)
    );
  };

  const handleRemoveCategory = (category: CategoryInterface) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter(
        (selectedCategory) => selectedCategory._id !== category._id
      )
    );
    setAvailableCategories((prevAvailableCategories) => {
      const updatedCategories = [...prevAvailableCategories, category];
      // Sort the updated categories to maintain the original order
      return updatedCategories.sort(
        (a, b) =>
          initialCategories.findIndex((cat) => cat._id === a._id) -
          initialCategories.findIndex((cat) => cat._id === b._id)
      );
    });
  };

  const handleCategoryClick = (
    e: MouseEvent<HTMLButtonElement>,
    category: CategoryInterface
  ) => {
    e.preventDefault();
    if (selectedCategories.some((c) => c._id === category._id)) {
      return; // Avoid duplicate selection
    }
    setSelectedCategories((prevSelectedCategories) => [
      ...prevSelectedCategories,
      category,
    ]);
    setAvailableCategories((prevAvailableCategories) =>
      prevAvailableCategories.filter(
        (availableCategory) => availableCategory._id !== category._id
      )
    );
  };

  useEffect(() => {
    if (fetchCategories?.data && Array.isArray(fetchCategories.data)) {
      setInitialCategories(fetchCategories.data);
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
            filteredCategories &&
            filteredCategories
              .slice(0, showMore ? amountOfCategories : 5)
              .map((category: CategoryInterface) => (
                <Button
                  key={`${category._id}`}
                  variant="outline"
                  className="flex items-center whitespace-normal gap-2 font-normal cursor-pointer justify-center w-full h-full px-2"
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
              placeholder="Search categories"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
            />
            <div className="grid gap-2">
              {selectedCategories &&
                selectedCategories.length > 0 &&
                selectedCategories.map((category: CategoryInterface) => (
                  <Button
                    key={`${category._id}`}
                    variant="default"
                    className="w-full justify-between items-center flex whitespace-normal px-2 py-6"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    <span className="flex-1 text-center ">{category.name}</span>
                    <XIcon classes="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Categories;
