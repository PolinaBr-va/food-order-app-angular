import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CommonModule} from '@angular/common';
import { Order, OrderItem, OrderStatus } from '../../models/order';
import { userProfile } from '../../models/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  orderHistory: Order[] = [];

  private fb = inject(FormBuilder);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.initForm();
    this.loadOrderHistory();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      localStorage.setItem('userProfile', JSON.stringify(formData));
      alert('Данные профиля успешно сохранены!');
    } else {
      alert('Пожалуйста, заполните все обязательные поля правильно.');
    }
  }

  onCancel(): void {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profileForm.patchValue(JSON.parse(savedProfile));
    } else {
      this.profileForm.reset();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profileForm.patchValue(JSON.parse(savedProfile));
    }
  }

  private loadOrderHistory(): Order[] {
    const orders = localStorage.getItem('orderHistory');
    if (orders) {
      try {
        const parsedOrders = JSON.parse(orders);
        this.orderHistory = parsedOrders.map((order: any) => ({
          ...order,
          date: new Date(order.date),
        }));
        return this.orderHistory;
      } catch (error) {
        console.error('Ошибка парсинга:', error);
        this.orderHistory = [];
        return [];
      }
    } else {
      this.orderHistory = [];
      return [];
    }
  }

  reorder(order: Order): void {
    order.items.forEach((item: OrderItem) => {
      this.cartService.addToCart(item.product, item.quantity, item.selectedSize);
    });
    alert('Заказ добавлен в вашу корзину!');
  }

  getStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      'В обработке': 'В обработке',
      Подтверждённый: 'Подтверждён',
      Приготовление: 'Приготовление',
      'Ожидает доставку': 'Ожидает доставку',
      Доставляется: 'Доставляется',
      Доставлено: 'Доставлено',
      Отменён: 'Отменён',
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: OrderStatus): string {
    const colorMap: Record<OrderStatus, string> = {
      'В обработке': '#f1be22ff',
      Подтверждённый: '#17a2b8',
      Приготовление: '#fd7e14',
      'Ожидает доставку': '#20c997',
      Доставляется: '#007bff',
      Доставлено: '#28a745',
      Отменён: '#dc3545',
    };
    return colorMap[status] || '#6c757d';
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  viewOrderDetails(order: Order) {
    alert(
      `Детали заказа #${order.id}\nСтатус: ${this.getStatusText(order.status)}\nСумма: ${
        order.total
      } руб.\nТоваров: ${this.getTotalItems(order)} шт.`
    );
  }

  cancelOrder(order: Order) {
    if (order.status === 'В обработке' || order.status === 'Подтверждённый') {
      order.status = 'Отменён';
      this.saveOrderHistory();
      alert('Заказ отменен');
    } else {
      alert('Невозможно отменить заказ в текущем статусе');
    }
  }

  private saveOrderHistory(): void {
    localStorage.setItem('orderHistory', JSON.stringify(this.orderHistory));
  }
}
