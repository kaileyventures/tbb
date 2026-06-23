export interface MenuItem {
  id?: string;
  name: string;
  desc?: string;
  category?: string;
  price?: string;
  badge?: string;
  images?: string;
  image?: string;
  variants?: string;
  variantOptions?: Array<{
    label: string;
    price: string;
  }>;
}
