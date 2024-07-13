import React from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { truncateText } from "@/utils/formats";

interface BlogPostProps {
  post: any;
}

const ProfileBlogCard: React.FC<BlogPostProps> = ({ post }) => {
  const { title, content, featureImg } = post;
  return (
    <Card className="group border-0">
      <Link href="#" className="contents" prefetch={false}>
        <CardContent className="grid gap-4">
          <Image
            src={`${featureImg}`}
            alt="Article Image"
            width={400}
            height={225}
            className="aspect-video w-full overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="grid gap-2">
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-muted-foreground line-clamp-3">
              {truncateText(content, 150)}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProfileBlogCard;
