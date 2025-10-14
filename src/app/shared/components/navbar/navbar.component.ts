import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseIcon, LucideAngularModule, MenuIcon, SearchIcon, ShoppingBagIcon, ShoppingCart, UserIcon, X } from 'lucide-angular';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  // -------------------------------
  // UI State Controls
  // -------------------------------
  isSearchOpen = false;  // controlled in HTML with @if(isSearchOpen)
  isDrawerOpen = false;  // controlled in HTML with @if(isDrawerOpen)

  // -------------------------------
  // Icons
  // -------------------------------
  CartIcon = ShoppingCart;
  UserIcons = UserIcon;
  SearchIcon = SearchIcon;
  MenuIcon = MenuIcon;
  XIcon = X;
  HomeIcon = HouseIcon;
  ShoppingIcon = ShoppingBagIcon;

  // -------------------------------
  // Toggle Methods
  // -------------------------------

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }
}