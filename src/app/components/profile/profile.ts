import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent  implements OnInit{
  profileForm: FormGroup;
  orderHistory: any[] = [];

  constructor(private fb: FormBuilder, private cartSerice: CartService) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Загрузка данных профиля из localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profileForm.patchValue(JSON.parse(savedProfile));
    }

     // Загрузка истории заказов
     this.orderHistory = this.loadOrderHistory();
  }

  onSubmit() {
    if (this.profileForm.valid) {
       // Сохранение профиля в localStorage
       localStorage.setItem('userProfile', JSON.stringify(this.profileForm.value));
       alert('Данные профиля успешно сохранены!');
    }
  }

  onCancel() {
    // Восстановление исходных значений
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profileForm.patchValue(JSON.parse(savedProfile));
    } else {
      this.profileForm.reset();
    }
  }

  loadOrderHistory() {
    // Загрузка истории заказов из localStorage
    const orders = localStorage.getItem('orderHostory');
    return orders ? JSON.parse(orders) : [];
  }

  reorder(order: any) {
    // Добавление товаров из заказа в корзину
    order.items.forEach((item: any) => {
      this.cartSerice.addToCart(item.product, item.quantity, item.selectedSize);
    });
    alert('Позиция добавлена в вашу корзину!');
  }
}
