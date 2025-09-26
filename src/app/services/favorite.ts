import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: Product[] = [];
  private favoritesSubject = new BehaviorSubject<Product[]>([]);

  constructor() { 
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
      this.favoritesSubject.next([...this.favorites]);
   }
 }

  addToFavorites(product: Product) {
    if (!this.isFavorite(product.id)) {
      this.favorites.push(product);
      this.updateStorage();
      this.favoritesSubject.next([...this.favorites]);
    }
  }

  removeFromFavorites(productId: number) {
    this.favorites = this.favorites.filter(p => p.id !== productId);
    this.updateStorage();
    this.favoritesSubject.next([...this.favorites]);
  }

  isFavorite(productId: number): boolean {
    return this.favorites.some(p => p.id === productId);
  }

  getFavorites(): Product[] {
    return this.favorites;
  }

  getFavoritesObservable() {
    return this.favoritesSubject.asObservable();
  }

  private updateStorage() {
    localStorage.setItem('favorites',  JSON.stringify(this.favorites))
  }
}
