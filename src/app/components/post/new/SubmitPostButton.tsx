import Button from "../../base/Button";

export default function SubmitPostButton({
  isLoading,
  disabled,
}: Readonly<{ isLoading: boolean; disabled: boolean }>) {
  return (
    <Button type="submit" disabled={isLoading || disabled}>
      <div className="relative flex items-center justify-center">
        <p className={`px-1 ${isLoading ? "invisible" : "visible"}`}>Post</p>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        )}
      </div>
    </Button>
  );
}
