import { useState } from "react";
import Button from "../base/Button";
import { TextInput } from "../post/new/TextInput";

interface Props {
  onAddComment: (text: string) => void;
}

export default function CommentInput({ onAddComment }: Readonly<Props>) {
  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

  return (
    <div className="mt-8 w-full">
      <div className="mb-4 flex justify-center">
        <TextInput
          placeholder="Add a comment..."
          value={comment}
          setTextValue={setComment}
        />
      </div>
      <div className="ml-2">
        <Button disabled={!comment.trim()} onClick={handleComment}>
          Comment
        </Button>
      </div>
    </div>
  );
}
