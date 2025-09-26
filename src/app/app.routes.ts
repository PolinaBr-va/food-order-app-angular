import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { FavoritesComponent } from './components/favorites/favorites';

import { CartComponent } from './components/cart/cart';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'cart', component: CartComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: '**', redirectTo: 'home' }
];
