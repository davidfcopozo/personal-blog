import { Bookmark, Clock, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const BlogCard = () => {
  return (
    <div className="max-w-sm w-full rounded-b-lg border-b rounded-b-lg transition-all duration-300 lg:max-w-full lg:flex lg:border-x-0 lg:border-secondary lg:rounded-b-none hover:scale-[1.02] lg:hover:rounded-b hover:shadow-[0px_1px_0px_0px] hover:shadow-muted-foreground">
      <Link
        href="#"
        className="flex h-48 lg:h-auto lg:w-80 bg-center rounded-t lg:rounded-tr-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: "url('/new-img.png')" }}
        title="Woman holding a mug"
      ></Link>
      <div className="flex flex-col justify-between leading-normal  px-4 py-4 bg-transparent lg:pt-0">
        <div className="mb-8">
          <p className="text-sm gap-1 text-center text-muted-foreground flex items-center pb-2">
            <Clock size={16} strokeWidth={2} />
            15 min read
          </p>
          <Link href="#" legacyBehavior>
            <a>
              <h2 className="text-foreground font-bold text-xl mb-2">
                Can coffee make you a better developer?
              </h2>
              <p className="text-foreground text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </a>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/#">
              <Image
                className="w-10 h-10 rounded-full mr-4"
                src="/TechyComm-Logo.svg"
                alt="Avatar of Jonathan Reinink"
                width={300}
                height={200}
              />
            </Link>
            <div className="text-sm">
              <Link href="/#" legacyBehavior>
                <a className="text-muted-foreground font-semibold leading-none transition-all duration-300 hover:text-foreground">
                  David Francisco
                </a>
              </Link>
              <p className="text-muted-foreground">Aug 18</p>
            </div>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <div className="flex justify-center transition-all duration-300 cursor-pointer hover:text-foreground">
              <Bookmark size={18} strokeWidth={2} />
              <span className="text-sm">5</span>
            </div>
            <div className="flex justify-center transition-all duration-300 cursor-pointer hover:text-foreground">
              <ThumbsUp size={18} strokeWidth={2} />
              <span className="text-sm">15</span>
            </div>
            <Link href="#" legacyBehavior>
              <a className="flex justify-center transition-all duration-300 hover:text-foreground">
                <MessageCircle size={18} strokeWidth={2} />
                <span className="text-sm">502</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
