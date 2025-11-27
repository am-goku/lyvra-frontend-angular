import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import ApiInterceptor from './core/interceptors/api.interceptor';
import JwtInterceptor from './core/interceptors/jwt.interceptor';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { BoxIcon, HouseIcon, LucideAngularModule, MenuIcon, SearchIcon, SettingsIcon, ShoppingCartIcon, UserIcon } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([ApiInterceptor, JwtInterceptor])
    ),
    provideOAuthClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home: HouseIcon,
        Menu: MenuIcon,
        ShoppingCart: ShoppingCartIcon,
        User: UserIcon,
        Search: SearchIcon,
        Settings: SettingsIcon,
        Box: BoxIcon
      })
    )
  ]
};
