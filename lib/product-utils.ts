import { Product } from '@/types/product';

export const statusStyles = {
  available: 'bg-green-100 text-green-700 hover:bg-green-100',
  reserved: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  sold: 'bg-red-100 text-red-700 hover:bg-red-100',
};

export const statusLabels = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};

export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function buildWhatsappUrl(product: Product): string {
  const message = product.availableDate
    ? `Olá! Tenho interesse em reservar ${product.title}, disponível em ${formatDate(product.availableDate)}.`
    : `Olá! Tenho interesse em reservar ${product.title}.`;

  return `https://wa.me/5531999999999?text=${encodeURIComponent(message)}`;
}

export function getProductImageUrl(slug: string, image: string): string {
  return `/products/${slug}/${image}`;
}

/**
 * Returns up to 8 products to show as "similar".
 * Priority: scored by name keywords + same category → same category → "outros" → any available.
 * Always fills up to `limit` unless fewer non-sold/reserved products exist.
 */
export function getSimilarProducts(
  current: Product,
  all: Product[],
  limit = 8,
): Product[] {
  const available = all.filter(
    (p) => p.id !== current.id && p.status !== 'sold' && p.status !== 'reserved',
  );

  const stopWords = new Set(['com', 'de', 'da', 'do', 'em', 'para', 'e', 'a', 'o', 'um', 'uma']);
  const keywords = current.title
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));

  const scored = available
    .map((p) => {
      let score = 0;
      if (p.category && current.category && p.category.some((c) => current.category!.includes(c))) score += 3;
      const pWords = p.title.toLowerCase().split(/\W+/);
      for (const kw of keywords) {
        if (pWords.includes(kw)) score += 1;
      }
      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const results = scored.slice(0, limit).map(({ product }) => product);

  const pad = (candidates: Product[]) => {
    if (results.length >= limit) return;
    const used = new Set(results.map((p) => p.id));
    for (const p of candidates) {
      if (results.length >= limit) break;
      if (!used.has(p.id)) {
        results.push(p);
        used.add(p.id);
      }
    }
  };

  // Pad with same-category products
  if (current.category) {
    pad(available.filter((p) => p.category?.some((c) => current.category!.includes(c))));
  }

  // Pad with "outros" category
  pad(available.filter((p) => p.category?.includes('outros')));

  // Pad with any remaining available products
  pad(available);

  return results;
}
