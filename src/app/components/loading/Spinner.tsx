import CenteredLayout from "../layout/CenteredLayout";

export default function Spinner() {
  return (
    <CenteredLayout>
      <div className="text-surface mt-10 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
        <output className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
          Loading...
        </output>
      </div>
    </CenteredLayout>
  );
}
