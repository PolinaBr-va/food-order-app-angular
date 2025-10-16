import { Injectable } from '@angular/core';
import { Product,  ProductsResponse} from '../models/product';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrls = 'assets/data/product.json';
  private cachedProducts$: Observable<ProductsResponse> | null = null;

  constructor(private http: HttpClient) {}

  private getProductsData(): Observable<ProductsResponse> {
    if (!this.cachedProducts$) {
      this.cachedProducts$ = this.http
        .get<ProductsResponse>(this.productsUrls)
        .pipe(shareReplay(1));
    }
    return this.cachedProducts$;
  }

  getProducts(): Observable<Product[]> {
    return this.getProductsData().pipe(map((data) => data.products));
  }

  getCategories(): Observable<string[]> {
    return this.getProductsData().pipe(map((data) => data.categories));
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => {
        if (!term.trim()) return products;

        const searchTerm = term.toLowerCase();
        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  getProductsById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }
}
