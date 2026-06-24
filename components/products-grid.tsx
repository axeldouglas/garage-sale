'use client';

import { useEffect, useMemo, useState } from 'react';

import { Product } from '@/types/product';
import { ProductCard } from './product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

type Props = {
  products: Product[];
  initialCategory?: string;
};

const statusOrder = {
  available: 0,
  reserved: 1,
  sold: 2,
};

export function ProductsGrid({ products, initialCategory }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory ?? 'all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(initialCategory ?? 'all');
  }, [initialCategory]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params =
      value === 'all' ? '/' : `/?category=${encodeURIComponent(value)}`;
    router.replace(params);
  };

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const matchesSearch =
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          category === 'all' ? true : product?.category?.includes(category);

        const matchesFavorites = onlyFavorites
          ? favorites.has(product.id)
          : true;

        const matchesAvailability = product.status !== 'sold' && product.status !== 'reserved';

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFavorites &&
          matchesAvailability
        );
      })
      .sort((a, b) => {
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];

        if (statusComparison !== 0) {
          return statusComparison;
        }

        if (a.availableDate && b.availableDate) {
          return (
            new Date(a.availableDate).getTime() -
            new Date(b.availableDate).getTime()
          );
        }

        return 0;
      });
  }, [products, search, category, onlyFavorites, favorites]);

  const filteredUnavailableProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const matchesSearch =
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          category === 'all' ? true : product?.category?.includes(category);

        const matchesFavorites = onlyFavorites
          ? favorites.has(product.id)
          : true;

        const matchesAvailability = product.status === 'sold' || product.status === 'reserved';

        return (
          matchesSearch &&
          matchesCategory &&
          matchesFavorites &&
          matchesAvailability
        );
      })
      .sort((a, b) => {
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];

        if (statusComparison !== 0) {
          return statusComparison;
        }

        if (a.availableDate && b.availableDate) {
          return (
            new Date(a.availableDate).getTime() -
            new Date(b.availableDate).getTime()
          );
        }

        return 0;
      });
  }, [products, search, category, onlyFavorites, favorites]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(filteredProducts.flatMap((p) => p.category ?? []).filter(Boolean)),
    );
  }, [filteredProducts]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        {/* Search */}
        {/* <Field orientation="horizontal"></Field> */}
        <Input
          type="search"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />

        <div className="flex gap-4">
          {/* Category */}
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Favorites */}
          <Button
            variant={onlyFavorites ? 'default' : 'outline'}
            onClick={() => setOnlyFavorites((v) => !v)}
            className={cn('gap-2 sm:w-auto', onlyFavorites && 'text-white')}
          >
            <Heart className={cn('h-4 w-4', onlyFavorites && 'fill-current')} />
            Favoritos
          </Button>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <details className="rounded-md border p-3 text-xs">
        <summary className="cursor-pointer text-sm font-medium">
          Produtos vendidos ou reservados
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredUnavailableProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </details>
    </div>
  );
}
