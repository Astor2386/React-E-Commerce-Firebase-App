// types.ts to create the details of the products
export interface Product {
  id?: string;
  category: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  products: { productId: string; quantity: number; price: number }[];
  totalPrice: number;
  createdAt: string;
}