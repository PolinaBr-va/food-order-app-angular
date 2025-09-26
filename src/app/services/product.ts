import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

interface ProductsResponse {
  products: Product[];
  categories: string[];
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private productsUrls = 'assets/data/product.json';
  private cachedProducts$: Observable<ProductsResponse> | null = null;

  constructor(private http: HttpClient) {}

  // Получение всех продуктов с кэшированием
  private getProductsData(): Observable<ProductsResponse> {
    if (!this.cachedProducts$) {
      this.cachedProducts$ = this.http.get<ProductsResponse>(this.productsUrls).pipe(
        shareReplay(1)
      )
    }
    return this.cachedProducts$;
  }

  // Получение всех продуктов
  getProducts(): Observable<Product[]> {
    return this.getProductsData().pipe(
      map(data => data.products)
    )
  }

  // Получение всех категорий
  getCategories(): Observable<string[]> {
    return this.getProductsData().pipe(
      map(data => data.categories)
    );
  }

  // Поиск продуктов по запросу
  searchProducts(term: string): Observable<Product[]> {
   return this.getProducts().pipe(
    map(products => {
      if (!term.trim()) return products;

      const searchTerm = term.toLowerCase();
      return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    })
   );
  }

  // Получение продукта по ID
  getProductsById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id))
     );
    }

  // Получение продуктов по категории
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        if (category === 'Все') return products;
        return products.filter(product => product.category === category);
      })
    );
  }

   // Очистка кэша (например, при обновлении данных)
    clearCache(): void {
      this.cachedProducts$ = null;
    }
}
