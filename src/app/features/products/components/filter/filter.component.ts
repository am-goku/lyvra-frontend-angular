import { Component, signal } from "@angular/core";
import { LucideAngularModule, SearchIcon, SlidersVertical, X, ChevronDown, ChevronUp, Check } from "lucide-angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'products-filter',
    standalone: true,
    imports: [LucideAngularModule, CommonModule, FormsModule],
    templateUrl: './filter.component.html'
})
export class FilterComponent {
    SliderIcon = SlidersVertical;
    XIcon = X;
    SearchIcon = SearchIcon;
    ChevronDownIcon = ChevronDown;
    ChevronUpIcon = ChevronUp;
    CheckIcon = Check;

    isDrawerOpen = false;

    // Collapsible sections
    expandedSections = signal({
        category: true,
        gender: true,
        price: true,
        color: true,
        brand: true,
        rating: true
    });

    // Filter states
    selectedCategories = signal<number[]>([]);
    selectedGenders = signal<string[]>([]);
    selectedColors = signal<number[]>([]);
    selectedBrands = signal<string[]>([]);
    minPrice = signal(0);
    maxPrice = signal(500);
    minRating = signal(0);
    searchQuery = signal('');

    // Mock data
    categories = [
        { id: 1, name: 'Sneakers', count: 234 },
        { id: 2, name: 'Boots', count: 156 },
        { id: 3, name: 'Sandals', count: 89 },
        { id: 4, name: 'Formal Shoes', count: 124 },
        { id: 5, name: 'Sports Shoes', count: 198 }
    ];

    genders = ['Men', 'Women', 'Kids', 'Unisex'];

    brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];

    colors = [
        { id: 1, name: 'Red', hex: '#EF4444' },
        { id: 2, name: 'Blue', hex: '#3B82F6' },
        { id: 3, name: 'Green', hex: '#10B981' },
        { id: 4, name: 'Yellow', hex: '#F59E0B' },
        { id: 5, name: 'Purple', hex: '#8B5CF6' },
        { id: 6, name: 'Pink', hex: '#EC4899' },
        { id: 7, name: 'Black', hex: '#1F2937' },
        { id: 8, name: 'White', hex: '#F3F4F6' }
    ];

    setIsDrawerOpen = () => this.isDrawerOpen = !this.isDrawerOpen;

    toggleSection(section: 'category' | 'gender' | 'price' | 'color' | 'brand' | 'rating') {
        this.expandedSections.update(sections => ({
            ...sections,
            [section]: !sections[section]
        }));
    }

    toggleCategory(id: number) {
        this.selectedCategories.update(cats =>
            cats.includes(id) ? cats.filter(c => c !== id) : [...cats, id]
        );
    }

    toggleGender(gender: string) {
        this.selectedGenders.update(genders =>
            genders.includes(gender) ? genders.filter(g => g !== gender) : [...genders, gender]
        );
    }

    toggleColor(id: number) {
        this.selectedColors.update(colors =>
            colors.includes(id) ? colors.filter(c => c !== id) : [...colors, id]
        );
    }

    toggleBrand(brand: string) {
        this.selectedBrands.update(brands =>
            brands.includes(brand) ? brands.filter(b => b !== brand) : [...brands, brand]
        );
    }

    clearAllFilters() {
        this.selectedCategories.set([]);
        this.selectedGenders.set([]);
        this.selectedColors.set([]);
        this.selectedBrands.set([]);
        this.minPrice.set(0);
        this.maxPrice.set(500);
        this.minRating.set(0);
        this.searchQuery.set('');
    }

    hasActiveFilters(): boolean {
        return this.selectedCategories().length > 0 ||
            this.selectedGenders().length > 0 ||
            this.selectedColors().length > 0 ||
            this.selectedBrands().length > 0 ||
            this.minPrice() > 0 ||
            this.maxPrice() < 500 ||
            this.minRating() > 0;
    }

    getActiveFilterCount(): number {
        return this.selectedCategories().length +
            this.selectedGenders().length +
            this.selectedColors().length +
            this.selectedBrands().length +
            (this.minPrice() > 0 || this.maxPrice() < 500 ? 1 : 0) +
            (this.minRating() > 0 ? 1 : 0);
    }
}