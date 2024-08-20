import BlogPost from "@/components/blog-post";

const Blog = ({ slug }: { slug: string }) => {
  return (
    <div>
      <BlogPost slug={slug} />
    </div>
  );
};

export default Blog;
