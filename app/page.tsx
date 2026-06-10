import { products } from '@/data/products';

import { ProductsGrid } from '@/components/products-grid';

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
        <h1 className="text-4xl font-bold">Liquidação</h1>

        <p className="text-muted-foreground mt-2">
          {filteredAvailableProducts.length} itens disponíveis entre móveis,
          eletrônicos e muito mais.
        </p>
      </div>

      <ProductsGrid products={products} initialCategory={category} />
    </main>
  );
}
