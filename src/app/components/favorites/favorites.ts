import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { FavoriteService } from '../../services/favorite';
import { CartService } from '../../services/cart';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ImageService } from '../../services/image';

@Component({
  selector: 'app-favorites',
  imports: [NgIf, CommonModule, NgFor, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit{
  favorites: Product[] = [];
  product: Product[] = [];

  constructor(
    private favoritesService: FavoriteService,
    private cartService: CartService,
    public imageService: ImageService
  ) {}

  ngOnInit() {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFromFavorites(product: Product) {
    this.favoritesService.removeFromFavorites(product.id);
    this.favorites = this.favoritesService.getFavorites();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    alert('Добавлено в корзину!')
  }
}
