import { Component } from '@angular/core';
import { CartItemListComponent } from './components/list-section/list.component';
import { CartSummaryComponent } from './components/summary-section/summary.component';
import { CartSuggestionComponent } from './components/suggestion-section/suggestion.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemListComponent, CartSummaryComponent, CartSuggestionComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {}
