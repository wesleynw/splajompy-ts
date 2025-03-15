import Button from "../../button/Button";

export default function SubmitPostButton({
  isLoading,
  disabled,
}: Readonly<{ isLoading: boolean; disabled: boolean }>) {
  return (
    <Button type="submit" disabled={isLoading || disabled}>
      Post
    </Button>
  );
}
