import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private basePath = 'assets/images';
  private categoryPath: { [key: string]: string } = {
    Бургеры: 'burgers',
    Пицца: 'pizza',
    Роллы: 'rolls',
    Напитки: 'drinks',
  };

  getProductImagePath(product: Product): string {
    const categoryPath = this.categoryPath[product.category] || 'default';
    return `${this.basePath}/${categoryPath}/${product.image}`;
  }
}
