'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/product';
import Image from 'next/image';
import { ProductGalleryThumbnail } from './product-gallery-thumbnail';

type Props = {
  product: Product;
};

export function ProductGallery({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const [backgroundPosition, setBackgroundPosition] = useState('50% 50%');

  const [showMagnifier, setShowMagnifier] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;

    const y = ((e.clientY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start w-full">
      {/* Thumbnails */}
      <ScrollArea className="h-[50px] w-full order-2 md:pr-2.5 md:h-[400px] md:w-[70px] md:order-1">
        <div className="flex md:flex-col gap-3">
          {product.images.length > 0 ? (
            product.images.map((image) => {
              const isSelected = selectedImage === image;

              return (
                <ProductGalleryThumbnail
                  key={image}
                  image={image}
                  title={product.title}
                  isSelected={isSelected}
                  onClick={() => setSelectedImage(image)}
                  onMouseEnter={() => setSelectedImage(image)}
                />
              );
            })
          ) : (
            <ProductGalleryThumbnail
              key={'empty'}
              image={'/empty-default.jpg'}
              title={product.title}
              isSelected={true}
              onClick={() => setSelectedImage('/empty-default.jpg')}
              onMouseEnter={() => setSelectedImage('/empty-default.jpg')}
            />
          )}
        </div>
      </ScrollArea>

      <div className="flex-1 rounded-2xl border bg-background order-1 md:order-2 w-full h-auto md:w-100 md:h-100">
        <div
          className={cn('relative aspect-square overflow-hidden h-full w-full', {
            'md:cursor-zoom-in': selectedImage,
          })}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          <Image
            className="dark:invert h-full w-full absolute inset-0 object-contain mx-auto my-auto"
            src={selectedImage ?? '/empty-default.jpg'}
            alt={product.title}
            width={500}
            height={500}
            unoptimized
          />
        </div>
      </div>

      {selectedImage && showMagnifier && (
        <div
          className="hidden md:block top-0 right-4 absolute h-150 w-150 pointer-events-none rounded-2xl border bg-background bg-origin-content"
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundPosition,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '250%',
          }}
        />
      )}
    </div>
  );
}
