import useEmblaCarousel from "embla-carousel-react";
import {
  DotButton,
  useDotButton,
} from "../../images/carousel/CarouselDotButton";
import ImagePreview from "./ImagePreview";

type Props = {
  images: File[];
  handleRemoveImage?: (index: number) => void;
};

export default function ImageCarousel({
  images,
  handleRemoveImage,
}: Readonly<Props>) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((image, index) => (
            <div className="w-full flex-none" key={index + image.name}>
              <div className="mt-4 overflow-hidden rounded-xl border-2 border-neutral-600">
                <ImagePreview
                  image={image}
                  handleRemoveImage={() => handleRemoveImage?.(index)}
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
                key={index + crypto.randomUUID()}
                onClick={() => onDotButtonClick(index)}
                className={"m-2 h-3 w-3 rounded-full border-3 border-neutral-600".concat(
                  index === selectedIndex ? "border-neutral-200" : "",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
