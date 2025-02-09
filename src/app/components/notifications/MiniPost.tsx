import { PostType } from "@/app/data/posts";
import { RenderMentions } from "@/app/utils/mentions";
import Image from "next/image";

type Props = {
  post: PostType;
};

export default function MiniPost({ post }: Readonly<Props>) {
  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${post?.imageBlobUrl}`;

  if (!post) {
    return;
  }

  return (
    <div className="my-2 rounded-md bg-neutral-700 p-2 transition-all group-hover:bg-neutral-600">
      {post.text && (
        <div className="font-bold">
          <RenderMentions text={post.text} />
        </div>
      )}
      {post.imageBlobUrl && (
        <Image
          alt={post.text ?? "Image"}
          src={src}
          width={150}
          height={150}
          className="mt-2.5 rounded-md"
        />
      )}
    </div>
  );
}
