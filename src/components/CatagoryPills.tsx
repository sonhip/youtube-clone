import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";

type CatagoryPillProps = {
  categories: string[];
  selectedCategory: string;
  onSelectedCategory: (category: string) => void;
};

const TRANSLATE_AMOUNT = 200;

export default function CatagoryPills({
  categories,
  selectedCategory,
  onSelectedCategory,
}: CatagoryPillProps) {
  const [isLeftVisible, setIsLeftVisible] = useState<boolean>(true);
  const [isRightVisible, setIsRightVisible] = useState<boolean>(true);
  const [translate, setTranslate] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;
    const observe = new ResizeObserver((entries) => {
      const container = entries[0].target;
      if (container === null) return;

      setIsLeftVisible(translate > 0);
      setIsRightVisible(
        translate + container.clientWidth < container.scrollWidth
      );
    });

    observe.observe(containerRef.current);
    return () => {
      observe.disconnect();
    };
  }, [categories, translate]);

  return (
    <div ref={containerRef} className="overflow-x-hidden relative">
      <div
        className="whitespace-nowrap flex gap-3 w-[max-content] transition-transform"
        style={{ transform: `translateX(-${translate}px)` }}
      >
        {categories.map((category) => (
          <Button
            onClick={() => onSelectedCategory(category)}
            variant={category === selectedCategory ? "dark" : "default"}
            key={category}
            className="py-1 px-3 rounded-lg whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      {isLeftVisible && (
        <div className=" absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white from-50% to-transparent w-24">
          <Button
            onClick={() =>
              setTranslate((translate) => {
                const newTranslate = translate - TRANSLATE_AMOUNT;
                if (newTranslate <= 0) return 0;
                return newTranslate;
              })
            }
            variant={"ghost"}
            size={"icon"}
            className="h-full aspect-square w-auto p-1.5"
          >
            <ChevronLeft />
          </Button>
        </div>
      )}
      {isRightVisible && (
        <div className=" absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white from-50% to-transparent w-24 flex justify-end">
          <Button
            onClick={() =>
              setTranslate((translate) => {
                if (containerRef.current === null) {
                  return translate;
                }
                const newTranslate = translate + TRANSLATE_AMOUNT;
                const edge = containerRef.current.scrollWidth;
                const width = containerRef.current.clientWidth;
                if (newTranslate + width >= edge) {
                  return edge - width;
                }
                return newTranslate;
              })
            }
            variant={"ghost"}
            size={"icon"}
            className="h-full aspect-square w-auto p-1.5"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
