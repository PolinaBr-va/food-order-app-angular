import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { FavoriteService } from '../../services/favorite';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart';
import { ImageService } from '../../services/image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterLink, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  allCategories: string[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'Все';
  isLoading: boolean = true;

  private subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    public imageService: ImageService
  ) {}

  ngOnInit() {
    const productsSub = this.productService.getProducts().subscribe(
      (products) => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      (err) => console.log('error ', err)
    );

    const categoriesSub = this.productService.getCategories().subscribe((categories) => {
      this.allCategories = ['Все', ...categories];
    });

    this.subscription.add(productsSub);
    this.subscription.add(categoriesSub);
  }

  onSearchChange() {
    if (this.searchTerm.trim()) {
      const searchSub = this.productService
        .searchProducts(this.searchTerm)
        .subscribe((products) => {
          this.filteredProducts = this.filterByCategory(products);
        });
      this.subscription.add(searchSub);
    } else {
      this.filteredProducts = this.filterByCategory(this.allProducts);
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filteredProducts = this.filterByCategory(
      this.searchTerm.trim() ? this.filteredProducts : this.allProducts
    );
  }

  private filterByCategory(products: Product[]): Product[] {
    if (this.selectedCategory === 'Все') return products;
    return products.filter((product) => product.category === this.selectedCategory);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Все';
    this.filteredProducts = this.allProducts;
  }

  toggleFavorite(product: Product) {
    if (this.isFavorite(product.id)) {
      this.favoriteService.removeFromFavorites(product.id);
    } else {
      this.favoriteService.addToFavorites(product);
    }
  }

  isFavorite(productId: number): boolean {
    return this.favoriteService.isFavorite(productId);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    alert('Товар добавлен в корзину!');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
