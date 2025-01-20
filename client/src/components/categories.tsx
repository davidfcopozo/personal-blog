import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { CategoryInterface } from "@/typings/interfaces";
import useFetchRequest from "@/hooks/useFetchRequest";
import { Skeleton } from "./ui/skeleton";
import { XIcon } from "./icons";
import { CategoriesProps } from "@/typings/types";

const Categories = ({
  setCategories,
  categories: passedCategories,
}: CategoriesProps) => {
  const {
    data: fetchedCategories,
    isLoading,
    isFetching,
    error,
  } = useFetchRequest(["categories"], "/api/categories");
  const [availableCategories, setAvailableCategories] = useState<
    CategoryInterface[]
  >([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryInterface[]
  >([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [amountOfCategories, setAmountOfCategories] = useState(5);
  const [initialCategories, setInitialCategories] = useState<
    CategoryInterface[]
  >([]);

  const isInitialSetup = useRef(true);

  useEffect(() => {
    if (fetchedCategories?.data && Array.isArray(fetchedCategories.data)) {
      setInitialCategories(fetchedCategories.data);
      setAvailableCategories(fetchedCategories.data);

      if (isInitialSetup.current) {
        isInitialSetup.current = false;
      }
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (passedCategories.length > 0 && isInitialSetup.current === false) {
      const selected = passedCategories
        .map((category) => {
          return fetchedCategories?.data?.find(
            (cat: CategoryInterface) =>
              cat._id.toString() === category?._id.toString()
          );
        })
        .filter(Boolean) as CategoryInterface[];

      const availableCats = fetchedCategories?.data?.filter(
        (category: CategoryInterface) =>
          !selected.find((selectedCat) => selectedCat._id === category._id)
      );

      setSelectedCategories(selected);
      setAvailableCategories(availableCats);
    }
  }, [passedCategories, fetchedCategories?.data]);

  const handleRemoveCategory = (category: CategoryInterface) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter(
        (selectedCategory) => selectedCategory._id !== category._id
      )
    );

    setAvailableCategories((prevAvailableCategories) => {
      const updatedCategories = [...prevAvailableCategories, category];
      return updatedCategories.sort(
        (a, b) =>
          initialCategories.findIndex((cat) => cat._id === a._id) -
          initialCategories.findIndex((cat) => cat._id === b._id)
      );
    });

    setCategories((prevCategories: CategoryInterface[]) =>
      prevCategories.filter(
        (c: CategoryInterface) => c._id.toString() !== category._id.toString()
      )
    );
  };

  const handleAddCategory = (category: CategoryInterface) => {
    if (selectedCategories.some((c) => c._id === category._id)) {
      return;
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
    setCategories((prevCategories: CategoryInterface[]) => [
      ...prevCategories,
      category,
    ]);
  };

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

  const filteredCategories = useMemo(() => {
    if (categorySearchQuery === "") {
      return availableCategories;
    }
    return (
      availableCategories &&
      availableCategories.filter((category) =>
        category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
      )
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
                  onClick={(e) => handleAddCategory(category)}
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
          <div className="relative grid grid-col gap-2 lg:items-center lg:gap-2 lg:grid lg:grid-cols-[1fr]">
            <Input
              placeholder="Search categories"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {selectedCategories &&
                selectedCategories.length > 0 &&
                selectedCategories.map((category: CategoryInterface) => (
                  <Button
                    key={`${category._id}`}
                    variant="default"
                    className="max-w-content justify-between items-center flex whitespace-normal px-2 py-6"
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
