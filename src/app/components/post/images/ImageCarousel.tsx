import { ImageType } from "@/db/schema";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./carousel/CarouselDotButton";
import ResponsiveImageModal from "./ResponsiveImageModal";

type Props = {
  images: ImageType[];
};

export default function ImageCarousel({ images }: Readonly<Props>) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="mt-4"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image) => (
            <div className="w-full flex-none pl-2" key={image.image_id}>
              <div className="overflow-hidden rounded-xl">
                <ResponsiveImageModal
                  path={image.image_blob_url}
                  height={image.height}
                  width={image.width}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length >= 2 && (
        <div className="flex max-h-10 flex-row items-center justify-center">
          <div className="flex flex-row flex-wrap">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`m-2 h-3 w-3 rounded-full ${index === selectedIndex ? "bg-neutral-200" : "bg-neutral-600"}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
