'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

type Props = {
  productId: string;
  /** 'icon' = outline icon-only button (for detail page); 'floating' = small absolute overlay (for cards) */
  variant?: 'icon' | 'floating';
};

export function FavoriteButton({ productId, variant = 'icon' }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productId);

  if (variant === 'floating') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(productId);
        }}
        aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={cn(
          'absolute top-3 right-3 z-10 rounded-full p-1.5 bg-background/80 backdrop-blur-sm shadow-sm transition-colors',
          active ? 'text-red-500' : 'text-muted-foreground hover:text-red-400',
        )}
      >
        <Heart className={cn('h-4 w-4', active && 'fill-current')} />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggle(productId)}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={cn(active && 'text-red-500 border-red-200 hover:text-red-600 hover:border-red-300')}
    >
      <Heart className={cn('h-4 w-4', active && 'fill-current')} />
    </Button>
  );
}
