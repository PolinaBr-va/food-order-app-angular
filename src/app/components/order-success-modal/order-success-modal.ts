import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success-modal',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-success-modal.html',
  styleUrl: './order-success-modal.css'
})
export class OrderSuccessModalComponent {
  @Output() close = new EventEmitter<void>();
  orderId: string;
  totalAmount: number;

  constructor(private cartService: CartService) {
    // Генерация ID заказа
    this.orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
    this.totalAmount = this.cartService.getTotalPrice();
  }

  onClose() {
    this.close.emit();
  }

  onTrackOrder() {
    alert('Здесь будет реализовано отслеживание заказов');
    this.onClose();
  }
}
