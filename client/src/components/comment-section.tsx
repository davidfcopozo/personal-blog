import Comment from "./comment";
import CommentBox from "./comment-box";

export default function CommentSection() {
  let comments = [
    {
      _id: "64d53253e973681ba9af5a61",
      postedBy: "648dce371dca718fb662f2aa",
      post: "68c7e2ca37fcaa5384a28fdd",
      content:
        "This is a great product! I've been using it for a few weeks and it's been a game-changer for my business.",
      replies: [
        {
          _id: "64d53253e973681ba9af5a61",
          postedBy: "648dce371dca718fb662f2aa",
          post: "68c7e2ca37fcaa5384a28fdd",
          content:
            "I agree, this product is amazing! The customer support has also been top-notch.",
          replies: [],
          likes: [],
          createdAt: new Date("2023-08-10T17:45:09.512+00:00"),
          updatedAt: new Date("2024-02-21T22:09:40.821+00:00"),
        },
      ],
      likes: [],
      createdAt: new Date("2023-08-10T17:45:23.077+00:00"),
      updatedAt: new Date("2023-08-10T18:43:31.354+00:00"),
    },
    {
      _id: "64d53253e973681ba9af5a61",
      postedBy: "648dce371dca718fb662f2aa",
      post: "68c7e2ca37fcaa5384a28fdd",
      content:
        "I'm really impressed with the features and ease of use. This is definitely a must-have for any business.",
      replies: [],
      likes: [],
      createdAt: new Date("2023-08-10T17:45:23.077+00:00"),
      updatedAt: new Date("2023-08-10T18:43:31.354+00:00"),
    },
  ];

  return (
    <div className="w-full max-w-3xl px-4 mx-auto space-y-6 mb-8 sm:px-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="grid gap-6">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      </div>
      <CommentBox />
    </div>
  );
}
