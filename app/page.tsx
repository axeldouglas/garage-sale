import { products } from '@/data/products';

import { ProductsGrid } from '@/components/products-grid';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Venda de Garagem',
    description: 'Encontre móveis, eletrônicos e muito mais em nossa venda de garagem.',
    openGraph: {
      title: 'Venda de Garagem',
      description: 'Encontre móveis, eletrônicos e muito mais em nossa venda de garagem.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Venda de Garagem',
      description: 'Encontre móveis, eletrônicos e muito mais em nossa venda de garagem.',
    },
  };
}

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;

  const filteredAvailableProducts = [...products].filter(
    (product) => product.status !== 'sold' && product.status !== 'reserved',
  );

  return (
    <main className="w-full max-w-7xl mx-auto p-6 mb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Venda de Garagem</h1>

        <p className="text-muted-foreground mt-2">
          {filteredAvailableProducts.length} itens disponíveis entre móveis,
          eletrônicos e muito mais.
        </p>
      </div>

      <ProductsGrid products={products} initialCategory={category} />
    </main>
  );
}
