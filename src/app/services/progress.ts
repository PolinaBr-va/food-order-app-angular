import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { CartService } from './cart';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  private showProgressBarSubject = new BehaviorSubject<boolean>(true);
  private showOrderSuccessModalSubject = new BehaviorSubject<boolean>(false);
  private cartItemCountSubject = new BehaviorSubject<number>(0);

  currentStep$ = this.currentStepSubject.asObservable();
  showProgressBar$ = this.showProgressBarSubject.asObservable();
  showOrderSuccessModal$ = this.showOrderSuccessModalSubject.asObservable();
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private router: Router, private cartService: CartService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.updateProgressBar(event.url));

    this.cartService.getCartItems().subscribe((items) => {
      const count = items.reduce((total, item) => total + item.quantity, 0);
      this.cartItemCountSubject.next(count);
    });

    this.cartService.orderSuccess$.subscribe((success) => {
      if (success) {
        this.showOrderSuccessModalSubject.next(true);
        this.currentStepSubject.next(3);
        this.showProgressBarSubject.next(true);
      }
    });
  }

  private updateProgressBar(url: string): void {
    const route = url.split('?')[0];

    if (this.showOrderSuccessModalSubject.value) {
      return;
    }

    if (url.includes('/home') || url === '/') {
      this.currentStepSubject.next(1);
      this.showProgressBarSubject.next(true);
    } else if (url.includes('/cart')) {
      this.currentStepSubject.next(2);
      this.showProgressBarSubject.next(true);
    } else if (route.includes('/order-success')) {
      this.currentStepSubject.next(3);
      this.showProgressBarSubject.next(true);
    } else {
      this.showProgressBarSubject.next(false);
    }
  }

  closeOrderSuccessModal(): void {
    this.showOrderSuccessModalSubject.next(false);
    this.currentStepSubject.next(1);
    this.showProgressBarSubject.next(true);
  }
}
