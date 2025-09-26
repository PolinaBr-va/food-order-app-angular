import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, RouterModule, Router, NavigationEnd} from "@angular/router";
import { CommonModule, NgIf } from '@angular/common';
import { CartService } from './services/cart';
import { filter } from 'rxjs';
import { OrderSuccessModalComponent } from "./components/order-success-modal/order-success-modal";

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, RouterModule, CommonModule, NgIf, OrderSuccessModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  currentStep = 1;
  showProgressBar = true;
  showOrderSuccesModal = false;
  cartItemCount = 0;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit() {
    // Отслеживаем изменения маршрута для обновления прогресс-бара
    this.router.events
     .pipe(filter(event => event instanceof NavigationEnd))
     .subscribe((event: NavigationEnd) => {
       this.updateProgressBar(event.url);
     });

     // Подписываемся на изменения в корзине
     this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
     });
  
     // Подписываемся на события успешного заказа
     this.cartService.orderSuccess$.subscribe(success => {
      if (success) {
        this.showOrderSuccesModal = true;
        this.currentStep = 3;
      }
     });
    }

  updateProgressBar(url: string) {
    if (url.includes('/home') || url === '/') {
      this.currentStep = 1;
      this.showProgressBar = true;
    } else if (url.includes('/cart')) {
      this.currentStep = 2;
      this.showProgressBar = true;
    } else {
      this.showProgressBar = false;
    }
  }
  }

