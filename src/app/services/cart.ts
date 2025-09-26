import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';


export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  orderSuccess$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Загрузка корзины из localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  addToCart(product: Product, quantity: number = 1, size?: string) {
    const existingItem = this.cartItems.find(item => 
      item.product.id === product.id && item.selectedSize === size
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
       product: { ...product },
       quantity, 
       selectedSize: size
      });
    }

    this.updateStorage();
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(item: CartItem) {
    const index = this.cartItems.findIndex(cartItem => 
      cartItem.product.id === item.product.id && 
      cartItem.selectedSize === item.selectedSize
    );

    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateStorage();
      this.cartSubject.next([...this.cartItems]);
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    const existingItem = this.cartItems.find(cartItem => 
      cartItem.product.id === item.product.id && 
      cartItem.selectedSize === item.selectedSize
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      this.updateStorage();
      this.cartSubject.next([...this.cartItems]);
    }
  }

  getCartItems(): Observable<CartItem[]> {
  return this.cartSubject.asObservable();
 }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) =>
    total + (item.product.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  placeOrder() {
    // Сохранение заказа в историю
    const order = {
     id: Math.random().toString(36).substring(2,9).toUpperCase(),
     date: new Date(),
     items: [...this.cartItems],
     total: this.getTotalPrice(),
     status: 'processing'
    };

    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orders.ushift(order);
    localStorage.setItem('orderHistory', JSON.stringify(orders));

    // Очистка корзины
    this.clearCart();

    // Уведомление об успешном заказе
    this.orderSuccess$.next(true);
  }

  private updateStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
