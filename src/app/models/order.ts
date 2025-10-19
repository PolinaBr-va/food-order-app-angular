import { CartItem, Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress?: string;
}

export type OrderStatus =
  | 'В обработке'
  | 'Подтверждённый'
  | 'Приготовление'
  | 'Ожидает доставку'
  | 'Доставляется'
  | 'Доставлено'
  | 'Отменён';
