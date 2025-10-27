import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { FavoriteService } from '../../services/favorite';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesComponent implements OnInit {
  favorites: Product[] = [];
  product: Product[] = [];

  constructor(
    private favoritesService: FavoriteService,
    private cartService: CartService,
    public imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFromFavorites(product: Product): void {
    this.favoritesService.removeFromFavorites(product.id);
    this.favorites = this.favoritesService.getFavorites();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert('Добавлено в корзину!');
  }
}
