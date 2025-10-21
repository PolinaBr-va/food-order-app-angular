import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success-modal',
  imports: [RouterLink, CommonModule],
  templateUrl: './order-success-modal.html',
  styleUrl: './order-success-modal.css',
})
export class OrderSuccessModalComponent {
  @Output() close = new EventEmitter<void>();
  orderId: string = '';
  totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getLastOrder();
  }

  private getLastOrder(): void {
    try {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (orders.length > 0) {
        const lastOrder = orders[0];
        this.orderId = lastOrder.id;
        this.totalAmount = lastOrder.total;
      }
    } catch (error) {
      console.error('Ошибка при получении последнего заказа:', error);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onTrackOrder(): void {
    alert('Здесь будет реализовано отслеживание заказов');
    this.onClose();
  }
}
