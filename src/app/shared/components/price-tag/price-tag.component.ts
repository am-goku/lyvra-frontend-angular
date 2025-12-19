import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-price-tag',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-baseline gap-2 flex-wrap" [class]="containerClass()">
      <!-- Main Price -->
      <span [class]="mainPriceClass()">
        {{ currency() }}{{ price() }}
      </span>

      <!-- Original Price (if discounted) -->
      @if (originalPrice()) {
        <span [class]="originalPriceClass()">
          {{ currency() }}{{ originalPrice()?.toFixed(2) }}
        </span>
        
        <!-- Discount Badge -->
        @if (showBadge()) {
          <span [class]="badgeClass()">
            Save {{ discountPercentage() }}%
          </span>
        }
      }
    </div>
  `
})
export class PriceTagComponent {
    price = input.required<number>();
    originalPrice = input<number>();
    currency = input('$');
    size = input<'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>('base');
    showBadge = input(true);

    discountPercentage = computed(() => {
        const original = this.originalPrice();
        const current = this.price();
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    });

    containerClass = computed(() => {
        return 'inline-flex';
    });

    mainPriceClass = computed(() => {
        const s = this.size();
        const base = 'font-bold text-indigo-600';
        switch (s) {
            case 'sm': return `${base} text-sm`;
            case 'base': return `${base} text-base`;
            case 'lg': return `${base} text-lg`;
            case 'xl': return `${base} text-xl`;
            case '2xl': return `${base} text-2xl`;
            case '3xl': return `${base} text-3xl`;
            case '4xl': return `${base} text-4xl`;
            default: return `${base} text-base`;
        }
    });

    originalPriceClass = computed(() => {
        const s = this.size();
        const base = 'text-gray-400 line-through';
        switch (s) {
            case 'sm': return `${base} text-xs`;
            case 'base': return `${base} text-sm`;
            case 'lg': return `${base} text-base`;
            case 'xl': return `${base} text-lg`;
            case '2xl': return `${base} text-xl`;
            case '3xl': return `${base} text-2xl`;
            case '4xl': return `${base} text-2xl`; // Cap at 2xl for strikethrough
            default: return `${base} text-sm`;
        }
    });

    badgeClass = computed(() => {
        return 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ml-1';
    });
}
