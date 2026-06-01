import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  image: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
};

export function ProductGalleryThumbnail({
  image,
  title,
  isSelected,
  onClick,
  onMouseEnter,
}: Props) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'h-12 w-12 md:h-15 md:w-15 overflow-hidden rounded-xl border-2 transition-all',
        isSelected ? 'border-primary' : 'border-transparent',
      )}
    >
      <Image
        className="dark:invert object-cover"
        src={image ?? '/empty-default.jpg'}
        alt={title}
        width={60}
        height={60}
        unoptimized
      />
    </button>
  );
}
