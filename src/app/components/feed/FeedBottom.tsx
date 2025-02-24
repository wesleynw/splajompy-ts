import CenteredLayout from "../layout/CenteredLayout";

export default function FeedBottom() {
  return (
    <div className="my-10">
      <CenteredLayout>
        <p className="text-center text-xl">
          Is that the very first post? <br />
          What came before that? <br />
          Nothing at all? <br />
          It always just <span className="font-black">Splajompy</span>
        </p>
      </CenteredLayout>
    </div>
  );
}
