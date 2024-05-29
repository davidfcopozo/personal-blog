import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const BlogCard = () => {
  return (
    <Link
      href="#"
      className="max-w-sm w-full rounded-b-lg border-b rounded-b-lg lg:max-w-full lg:flex hover:shadow-sm hover:shadow-muted-foreground lg:border-l-0 lg:border-secondary lg:rounded-b-none lg:hover:rounded-r"
    >
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-center rounded-t lg:rounded-tr-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: "url('/new-img.png')" }}
        title="Woman holding a mug"
      ></div>
      <div className="flex flex-col justify-between leading-normal p-4 bg-transparent ">
        <div className="mb-8">
          <p className="text-sm gap-1 text-center text-muted-foreground flex items-center">
            <Clock size={16} strokeWidth={2} />
            15 min read
          </p>
          <div className="text-foreground font-bold text-xl mb-2">
            Can coffee make you a better developer?
          </div>
          <p className="text-foreground text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>
        <div className="flex items-center">
          <Image
            className="w-10 h-10 rounded-full mr-4"
            src="/TechyComm-Logo.svg"
            alt="Avatar of Jonathan Reinink"
            width={300}
            height={200}
          />
          <div className="text-sm">
            <p className="text-muted-foreground font-semibold  leading-none">
              David Francisco
            </p>
            <p className="text-muted-foreground">Aug 18</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
