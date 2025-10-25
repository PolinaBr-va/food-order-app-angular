import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { Subscription } from 'rxjs/internal/Subscription';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../models/product';
import { Order, OrderItem } from '../../models/order';
import { userProfile } from '../../models/user';


@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  userProfile: userProfile[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService, public imageService: ImageService) {}

  ngOnInit(): void {
    const cartSub = this.cartService.getCartItems().subscribe(
      (items) => {
        this.cartItems = items;
        this.total = this.cartService.getTotalPrice();
      },
      (err) => console.log('error ', err)
    );

    this.subscription.add(cartSub);
  }

  onUpdateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.cartService.removeFromCart(item);
    } else {
      const updatedItem: CartItem = {
        ...item,
        quantity: quantity,
      };
      this.cartService.updateQuantity(updatedItem, quantity);
    }
  }

  onRemoveItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    const userProfile = this.getUserProfile();

    const order: Order = this.createOrder(userProfile);
    if (!userProfile.fullName || !userProfile.phone) {
      alert('Пожалуйста, заполните профиль пользователя перед оформлением заказа!');
      return;
    }
    this.cartService.placeOrder();

    this.cartService.clearCart();
  }

  private getUserProfile(): any {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error('Ошибка парсинга:', error);
      }
    }
    return {};
  }

  private createOrder(userProfile: userProfile): Order {
    const orderItems: OrderItem[] = this.cartItems.map((item) => ({
      ...item,
    }));

    return {
      id: this.generateOrderId(),
      date: new Date(),
      items: orderItems,
      total: this.total,
      status: 'В обработке',
      customerName: userProfile.fullName || 'Не указано',
      customerPhone: userProfile.phone || 'Не указано',
      customerEmail: userProfile.email || 'Не указано',
      deliveryAddress: userProfile.address || 'Не указано',
    };
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `Заказ-${timestamp}-${random}`.toUpperCase();
  }

  private saveOrderToHistory(order: Order): void {
    try {
      const existingOrders = localStorage.getItem('orderHistory');
      const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];

      orders.unshift(order);

      localStorage.setItem('orderHistory', JSON.stringify(orders));
    } catch (error) {
      console.error('Ошибка при сохранении заказа в историю:', error);
      alert('Ошибка при сохранении заказа в историю.');
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
