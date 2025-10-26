import { Component, OnInit, signal } from '@angular/core';
import { CartItemListComponent } from './components/list-section/list.component';
import { CartSummaryComponent } from './components/summary-section/summary.component';
import { CartSuggestionComponent } from './components/suggestion-section/suggestion.component';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemListComponent, CartSummaryComponent, CartSuggestionComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  constructor(private readonly cartService: CartService) { };

  cart = signal<Cart | null>(null);

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        console.log('cart response', res);
        this.cart.set(res);
      },
      error: (err) => console.log('cart error', err)
    })
  }

  removeItem(id: number) {
    console.log('triggering remove item fn')
    this.cartService.removeFromCart(id).subscribe({
      next: (res) => {
        console.log('remove', res)
        this.cart.update((prev: Cart | null) => {
          if (!prev) {
            // If prev is null, return null or a default Cart object
            return null;
          }
          return {
            ...prev,
            items: prev.items.filter(i => i.id !== id) // prev.items is guaranteed to be CartItem[]
          };
        });
      },
      error: (err) => console.log('error removing', err)
    })
  }

  decreaseQty(id: number) {
    this.cartService.addQuantity(id).subscribe({
      next: (res) => {
        console.log('response', res);
        this.cart.update((prev: Cart | null) => {
          if (!prev) {
            // If prev is null, return null or a default Cart object
            return null;
          }
          return {
            ...prev,
            items: prev.items.map(i => {
              if (i.id === id) i.quantity--;
              return i
            }) // prev.items is guaranteed to be CartItem[]
          };
        })
      },
      error(err) {
        console.log('error', err)
      },
    })
  }

  increaseQty(id: number) {
    this.cartService.addQuantity(id).subscribe({
      next: (res) => {
        console.log('response', res);
        this.cart.update((prev: Cart | null) => {
          if (!prev) {
            // If prev is null, return null or a default Cart object
            return null;
          }
          return {
            ...prev,
            items: prev.items.map(i => {
              if (i.id === id) i.quantity++;
              return i
            }) // prev.items is guaranteed to be CartItem[]
          };
        })
      },
      error(err) {
        console.log('error', err)
      },
    })
  }
}
