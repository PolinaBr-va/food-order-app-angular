import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../../services/favorite';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImageService } from '../../services/image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf, NgFor, FormsModule, RouterLink, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  selectedSize: string = '';
  quantity: number = 1;
  isLoading: boolean = true;
  isFavorite: boolean = false;

  private subscription: Subscription = new Subscription();

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  public imageService = inject(ImageService);

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (productId) {
      const productSub = this.productService.getProductsById(productId).subscribe({
        next: (product) => {
          if (product) {
            this.product = product;
            this.isFavorite = this.favoriteService.isFavorite(product.id);

            if (product.sizes && product.sizes.length) {
              this.selectedSize = product.sizes[0];
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });

      this.subscription.add(productSub);
    } else {
      this.isLoading = false;
    }
  }

  onAddToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
      alert('Добавлено в корзину!');
    }
  }

  toggleFavorite(): void {
    if (this.product) {
      if (this.isFavorite) {
        this.favoriteService.removeFromFavorites(this.product.id);
      } else {
        this.favoriteService.addToFavorites(this.product);
      }
      this.isFavorite = !this.isFavorite;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
