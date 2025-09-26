import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart';
import { NgFor, NgIf } from "@angular/common";
import { Subscription } from 'rxjs/internal/Subscription';
import { RouterLink } from "@angular/router";
import { ImageService } from '../../services/image';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgFor, NgIf, RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit{
   cartItems: CartItem[] = [];
   total: number = 0;
   private cartSubscription: Subscription | null = null;

   constructor(
    private cartService: CartService,
    public imageService: ImageService
   ) {}

   ngOnInit(): void {
     // Подписываемся на изменения корзины
     this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotalPrice();
     })
    }

   onUpdateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.cartService.removeFromCart(item);
    } else {
      // Создаем новый объект с обновленным количеством
      const updatedItem: CartItem = {
        ...item,
        quantity: quantity
      };
      this.cartService.updateQuantity(updatedItem, quantity);
    }
  }

   onRemoveItem(item: CartItem): void {
    this.cartService.removeFromCart(item);
   }

   onCheckout(): void {
    this.cartService.clearCart();
    alert('Оплата прошла успешно!')
   }
}
