import { useState } from "react";
import Button from "../base/Button";
import Input from "../base/form/Input";

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
    <div className="mt-5">
      <div>
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="border-1 border-neutral-500"
        />
      </div>
      <Button disabled={!comment.trim()} onClick={handleComment}>
        Comment
      </Button>
    </div>
  );
}
