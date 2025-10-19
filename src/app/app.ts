import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { OrderSuccessModalComponent } from './components/order-success-modal/order-success-modal';
import { ProgressService } from './services/progress';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    RouterModule,
    CommonModule,
    NgIf,
    OrderSuccessModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  currentStep = 1;
  showProgressBar = true;
  showOrderSuccesModal = false;
  cartItemCount = 0;

  constructor(private progressService: ProgressService) {}

  ngOnInit() {
    this.progressService.currentStep$.subscribe((step) => (this.currentStep = step));
    this.progressService.showProgressBar$.subscribe((show) => (this.showProgressBar = show));
    this.progressService.showOrderSuccessModal$.subscribe(
      (show) => (this.showOrderSuccesModal = show)
    );
    this.progressService.cartItemCount$.subscribe((count) => (this.cartItemCount = count));
  }

  closeOrderSuccessModal(): void {
    this.progressService.closeOrderSuccessModal();
  }
}
