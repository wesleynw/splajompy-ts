import Button from "../../base/Button";

export default function SubmitPostButton({
  isLoading,
  disabled,
}: Readonly<{ isLoading: boolean; disabled: boolean }>) {
  return (
    <Button type="submit" disabled={isLoading || disabled}>
      <p className="px-1">Post</p>
    </Button>
  );
}
