import BlogPost from "@/components/blog-post";

const Blog = async ({ params }: { params: { slug: string[] } }) => {
  const slug = decodeURI(params.slug.join("/"));

  return (
    <div>
      <BlogPost slug={slug} />
    </div>
  );
};

export default Blog;
