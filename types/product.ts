export type ProductStatus = 'available' | 'reserved' | 'sold';

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;

  /**
   * ISO date string
   * Example: 2026-06-15
   */
  availableDate?: string;
  quantity?: number;
  category?: string[];
  originalLink?: string;
  who?: string[];
};
