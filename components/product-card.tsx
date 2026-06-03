import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  statusStyles,
  statusLabels,
  formatPrice,
  formatDate,
  buildWhatsappUrl,
} from '@/lib/product-utils';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { FavoriteButton } from '@/components/favorite-button';
import { InfoIcon } from 'lucide-react';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const whatsappUrl = buildWhatsappUrl(product);

  const isUnavailable =
    product.status === 'reserved' || product.status === 'sold';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedAvailableDate = product.availableDate
    ? new Date(product.availableDate + 'T00:00:00')
    : null;
  const hasFutureDate =
    parsedAvailableDate !== null && parsedAvailableDate > today;
  const isPastDate =
    parsedAvailableDate !== null && parsedAvailableDate <= today;

  // Show "Disponível" badge only when there is a future availableDate
  const showStatusBadge = product.status !== 'available' || isPastDate;

  return (
    <Card
      className={cn(
        'relative overflow-hidden py-0 gap-0',
        isUnavailable && 'opacity-60',
      )}
    >
      {/* Floating Favorite */}
      <FavoriteButton productId={product.id} variant="floating" />

      {/* Floating Badge */}
      {showStatusBadge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className={statusStyles[product.status]}>
            {statusLabels[product.status]}
          </Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <Image
          className="dark:invert object-contain mx-auto my-auto w-full h-full md:h-[200px] md:w-[300px]"
          src={product.images[0] ?? '/empty-default.jpg'}
          alt={product.title}
          width={400}
          height={400}
          unoptimized
        />
      </Link>

      <CardContent className="flex flex-col h-full p-4 space-y-4">
        <div>
          {product.category?.map((cat) => (
            <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`}>
              <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity">
                {cat}
              </Badge>
            </Link>
          ))}
          <Link href={`/products/${product.slug}`}>
            <h2 className="text-lg font-semibold hover:underline truncate">
              {product.title}
            </h2>
          </Link>

          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold">{formatPrice(product.price)}</p>

          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Para reservar qualquer produto, será cobrado um valor de 20% do
                preço (sem reembolso).
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {isUnavailable ? (
          <p className="text-sm text-muted-foreground">Indisponível</p>
        ) : hasFutureDate && product.availableDate ? (
          <p className="text-sm">
            * Disponível em{' '}
            <span className="font-medium">
              {formatDate(product.availableDate)}
            </span>
          </p>
        ) : (
          <p className="text-sm">Reserve antes que seja tarde demais</p>
        )}

        <div className="w-full mt-auto">
          <Button
            asChild={!isUnavailable}
            disabled={isUnavailable}
            className="w-full"
          >
            {isUnavailable ? (
              <span>{statusLabels[product.status]}</span>
            ) : (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Reservar
              </a>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
