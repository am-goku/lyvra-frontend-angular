import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseIcon, LucideAngularModule, MenuIcon, SearchIcon, ShoppingBagIcon, ShoppingCart, UserIcon, X } from 'lucide-angular';
import { NavigationEnd, Router, RouterLink } from '@angular/router'
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  currentRoute: string = '';
  private routeSub: Subscription;

  constructor(private router: Router) {
    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const segments = event.urlAfterRedirects.split('/').filter(Boolean);
        this.currentRoute = segments.length > 0 ? segments[0] : 'home';
        console.log('First path segment:', this.currentRoute);
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }


  isSearchOpen = false;  // controlled in HTML with @if(isSearchOpen)
  isDrawerOpen = false;  // controlled in HTML with @if(isDrawerOpen)


  CartIcon = ShoppingCart;
  UserIcons = UserIcon;
  SearchIcon = SearchIcon;
  MenuIcon = MenuIcon;
  XIcon = X;
  HomeIcon = HouseIcon;
  ShoppingIcon = ShoppingBagIcon;


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