"use client";

import User from "@/components/user";

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const blogPosts = [
    {
      id: 1,
      title: "Introduction to React Hooks",
      date: "2023-05-15",
      views: 1200,
    },
    {
      id: 2,
      title: "Building Responsive Layouts with Tailwind CSS",
      date: "2023-06-02",
      views: 980,
    },
    {
      id: 3,
      title: "Getting Started with Next.js",
      date: "2023-06-20",
      views: 1500,
    },
    {
      id: 4,
      title: "Advanced TypeScript Techniques",
      date: "2023-07-10",
      views: 850,
    },
  ];

  return (
    <div className="min-h-screen mt-14">
      <User id={id} />
      {/* <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="rounded-full mb-4"
                  />
                  <h1 className="text-2xl font-bold mb-2">
                    {getFullName(user)}
                  </h1>
                  <p className="text-muted-foreground text-center mb-4">
                    Full-stack developer passionate about creating intuitive and
                    efficient web applications.
                  </p>
                  <div className="flex space-x-4 mb-4">
                    <Link href="#" passHref>
                      <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                        <span className="sr-only">X</span>
                      </Button>
                    </Link>
                    <Link href="#" passHref>
                      <Button variant="outline" size="icon">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </Link>
                    <Link href="#" passHref>
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>Tailwind CSS</Badge>
                  </div>
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Contact Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <Link href={`/blog/${post.id}`} passHref>
                        <h2 className="text-xl font-semibold hover:text-primary">
                          {post.title}
                        </h2>
                      </Link>
                      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                        <span>{post.date}</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UserPage;
