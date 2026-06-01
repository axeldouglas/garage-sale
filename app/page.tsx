import { products } from '@/data/products';

import { ProductsGrid } from '@/components/products-grid';

export default function HomePage() {
  return (
    <main className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Liquidação</h1>

        <p className="text-muted-foreground mt-2">
          Móveis, eletrônicos e muito mais.
        </p>
      </div>

      <ProductsGrid products={products} />
    </main>
  );
}
