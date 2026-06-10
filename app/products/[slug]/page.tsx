import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  const imageUrl = product.images[0]
    ? `/products/${product.slug}/${product.images[0]}`
    : undefined;

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

import {
  statusStyles,
  statusLabels,
  formatPrice,
  formatDate,
  buildWhatsappUrl,
} from '@/lib/product-utils';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { ProductGallery } from '@/components/product-gallery';
import { Separator } from '@/components/ui/separator';
import { ProductGalleryCarousel } from '@/components/product-gallery-carousel';
import { getSimilarProducts } from '@/lib/product-utils';
import { ShareButton } from '@/components/share-button';
import { FavoriteButton } from '@/components/favorite-button';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedAvailableDate = product.availableDate
    ? new Date(product.availableDate + 'T00:00:00')
    : null;
  const hasFutureDate =
    parsedAvailableDate !== null && parsedAvailableDate > today;

  const whatsappUrl = buildWhatsappUrl(product);
  const similarProducts = getSimilarProducts(product, products);

  const isUnavailable =
    product.status === 'reserved' || product.status === 'sold';

  const filteredAvailableProducts = [...products].filter(
    (product) => product.status !== 'sold' && product.status !== 'reserved',
  );

  return (
    <main className="max-w-7xl mx-auto p-6 mb-20">
      <div className="mb-6 md:mb-10">
        <h1 className="text-4xl font-bold">Venda de Garagem</h1>
        <p className="text-muted-foreground mt-2">
          {filteredAvailableProducts.length} itens disponíveis entre móveis,
          eletrônicos e muito mais.
        </p>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-8 md:mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-xs truncate">
              {product.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content */}
      <div className="flex gap-10 md:gap-20 w-full flex-col md:flex-row relative">
        <ProductGallery product={product} />

        {/* Details */}
        <div className="space-y-6 w-full">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl md:text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <FavoriteButton productId={product.id} />
                <ShareButton title={product.title} slug={product.slug} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={cn(statusStyles[product.status])}>
                {statusLabels[product.status]}
              </Badge>
              {product.category?.map((cat) => (
                <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>

            <p className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </p>

            {hasFutureDate && product.availableDate ? (
              <p className="text-sm">
                * Disponível em{' '}
                <span className="font-medium">
                  {formatDate(product.availableDate)}
                </span>
              </p>
            ) : null}
          </div>

          <p className=" text-muted-foreground leading-7  whitespace-pre-wrap">
            {product.description}
          </p>

          <Button
            asChild={!isUnavailable}
            disabled={isUnavailable}
            size="lg"
            className="w-full sm:w-fit md:min-w-[200px]"
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
      </div>

      <Separator className="my-16" />

      <ProductGalleryCarousel products={similarProducts} />
    </main>
  );
}
