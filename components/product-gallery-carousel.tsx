'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/types/product';

type Props = {
  products: Product[];
};

export function ProductGalleryCarousel({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold mb-6">Produtos semelhantes</h2>

      <Carousel opts={{ loop: true }} className="w-full max-w-xs md:max-w-full mx-auto">
        <CarouselContent className="">
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-[300px]">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </Carousel>
    </section>
  );
}

