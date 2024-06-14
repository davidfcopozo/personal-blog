import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPost = () => {
  return (
    <div className="w-full h-full bg-background">
      <div className="w-full mx-auto py-10 bg-background">
        {/* Breadcrumbs */}

        {/*         <div className="w-[94%] text-xs mt-10 mx-auto flex gap-1 items-center text-gray-500 sm:text-[12px] xs:text-[10px] font-semibold dark:text-gray-400">
          <div>Blog</div>
          <div className="font-semibold text-xs">{">"}</div>
          <div>Framework</div>
          <div className="font-semibold text-xs">{">"}</div>
          <div>Why Tailwind CSS Wins My Utility Belt</div>
        </div> */}

        <h1 className="w-[92%] mx-auto text-2xl text-center font-serif font-semibold pb-4 pt-10 text-foreground md:pt-12 md:pb-8 lg:text-4xl md:text-3xl">
          Why Tailwind CSS Wins My Utility Belt: A Dev&apos;s Guide
        </h1>

        {/* Blog cover */}
        <div className="flex items-center justify-center xl:w-[80%] w-[96%] mx-auto lg:h-[560px] md:h-[480px]">
          <Image
            src="/new-img.png"
            alt="Blog Cover"
            className="rounded-lg overflow-hidden aspect-square"
            width={500}
            height={250}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/*  <!-- Blog Info --> */}
        <div className="w-[90%] mx-auto flex md:gap-4 gap-2 justify-center items-center pt-4">
          <div className="flex gap-2 items-center">
            <Link href="/#">
              <Image
                className="w-10 h-10 rounded-full"
                src="/TechyComm-Logo.svg"
                alt="Avatar of Jonathan Reinink"
                width={300}
                height={200}
              />
            </Link>
            <Link href="/#" className="text-sm font-semibold dark:text-white">
              David Francisco
            </Link>
          </div>
          <div className="dark:text-gray-500">|</div>

          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Jun 8, 2024
          </h3>

          <div className="dark:text-gray-500">|</div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            5 min read
          </h4>
        </div>

        {/* <!-- Blog --> */}
        <div className="py-6 bg-background">
          <div className="md:w-[80%] w-[90%] mx-auto pt-4">
            <p className="mx-auto text-md dark:text-gray-300">
              In the world of CSS frameworks, there are plenty of contenders
              vying for your attention. But for me, Tailwind CSS stands out from
              the pack. Here&apos;s why Tailwind CSS is my go-to for building
              modern websites:
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              1. Utility-First Philosophy
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Tailwind ditches bulky pre-built components and instead offers a
              massive toolbox of utility classes. These classes, like{" "}
              {"text-red-500"} or {"flex justify-center,"} target specific
              styles (color, layout) and can be easily combined to achieve your
              desired look. This gives you ultimate control and keeps your CSS
              nice and lean.
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              2. Rapid Prototyping
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Need to get a design off the ground quickly? Tailwind&apos;s
              utility classes make it a breeze. Forget digging through
              stylesheets - just apply classes directly in your HTML. This lets
              you iterate on designs faster and see the visual changes
              instantly.
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              3. Responsive Out of the Box
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Tailwind&apos;s utility classes are inherently responsive, meaning
              they adapt to different screen sizes. No need for complex media
              queries - just add a responsive variant to your class (e.g.{" "}
              {"text-lg"} for large screens). This saves you time and ensures
              your website looks sharp on any device.
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              4. Customization King
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Don&apos;t be fooled by Tailwind&apos;s utility-first approach.
              You can still create custom themes and components. Need a specific
              button style? No problem, define it with custom CSS and reuse it
              throughout your project. Tailwind integrates seamlessly with your
              existing workflow.
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              5. Framework Agnostic
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Tailwind plays well with others. Whether you&apos;re using React,
              Vue, Angular, or plain JavaScript, Tailwind integrates without a
              hitch. This flexibility makes it a valuable asset for any project
              regardless of your preferred framework.
            </p>

            <h1 className="font-semibold text-lg mt-4 dark:text-white">
              Conclusion
            </h1>
            <p className="mt-2 text-md dark:text-gray-300">
              Tailwind CSS offers a unique approach to styling that prioritizes
              speed, customization, and responsiveness. It&apos;s a powerful
              tool that can streamline your workflow and help you build
              beautiful, modern websites. So, if you&apos;re looking for a CSS
              framework that empowers you to create with freedom, give Tailwind
              CSS a try!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
