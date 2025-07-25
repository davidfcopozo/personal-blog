import BlogPost from "@/components/blog-post";

const Blog = async (props: { params: Promise<{ slug: string[] }> }) => {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));

  return (
    <div>
      <BlogPost slug={slug} />
    </div>
  );
};

export default Blog;
