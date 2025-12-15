import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../core/services/products.service';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../../../models/category.model';

// --- Inline SVG Icons (Keep existing or import from Lucide) ---
const SVG_ICONS = {
    // ... kept for brevity or can use Lucide ...
    Package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 mr-3 text-indigo-600"><path d="m7.5 4.27 9 5.15"/><path d="m21 8.27-9-5.15-9 5.15"/><path d="m3.27 12 9 5.15 9-5.15"/><path d="M12 22V17.3"/><path d="M3.27 12v5.15"/><path d="M21 12v5.15"/></svg>`,
    Tag: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><path d="M12.586 10.914 19 4.5l-2-2L14.086 7.414"/><path d="M15 16l-1 1l-2-2l1-1"/><path d="M21 12V3h-9L2 12l10 10z"/></svg>`,
    DollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    Tags: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-indigo-500"><path d="M2 3h1.3c.7 0 1.4.3 1.7 1C6.2 6 7 7.5 7 9c0 1.5-1 3-2.7 3.5L3 13.5v7.5"/><path d="M19 3h1.3c.7 0 1.4.3 1.7 1C23.2 6 24 7.5 24 9c0 1.5-1 3-2.7 3.5L20 13.5v7.5"/><path d="M7 3h1.3c.7 0 1.4.3 1.7 1C11.2 6 12 7.5 12 9c0 1.5-1 3-2.7 3.5L8 13.5v7.5"/></svg>`,
    Search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    Check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-indigo-600"><polyline points="20 6 9 17 4 12"/></svg>`,
    X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`,
    ImagePlus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" y1="5" x2="22" y2="5"/><line x1="19" y1="2" x2="19" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    Loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
};

@Component({
    selector: 'app-root',
    templateUrl: './new-product.component.html',
    styleUrls: ['./new-product.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNewProductComponent implements OnInit {
    protected SVG_ICONS = SVG_ICONS;
    private fb = inject(FormBuilder);
    private productService = inject(ProductService);
    private categoryService = inject(CategoryService);
    private notification = inject(NotificationService);
    private router = inject(Router);

    categoryOptions = signal<Category[]>([]);
    selectedCategories = signal<Category[]>([]);
    uploadedImages = signal<File[]>([]);
    isLoading = signal(false);
    statusMessage = signal('');
    isSuccess = signal(true);

    categorySearchTerm = signal('');
    isCategoryDropdownOpen = signal(false);
    XIcon = XIcon;

    filteredCategories = computed(() => {
        const term = this.categorySearchTerm().toLowerCase();
        const selectedIds = this.selectedCategories().map(c => c.id);
        return this.categoryOptions()
            .filter(cat => !selectedIds.includes(cat.id))
            .filter(cat => cat.name.toLowerCase().includes(term));
    });

    maxImagesReached = computed(() => this.uploadedImages().length >= 4);

    productForm: FormGroup = this.fb.group({
        name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(100)], nonNullable: true }),
        description: this.fb.control<string | null>(null),
        price: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0.01)], nonNullable: false }),
    });

    ngOnInit() {
        this.loadCategories();
        effect(() => {
            this.selectedCategories();
            this.categorySearchTerm.set('');
        });
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (cats) => this.categoryOptions.set(cats),
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    isSelected(categoryId: number): boolean {
        return this.selectedCategories().some(c => c.id === categoryId);
    }

    toggleCategory(category: Category) {
        this.selectedCategories.update(current => {
            if (current.some(c => c.id === category.id)) {
                return current.filter(c => c.id !== category.id);
            } else {
                this.isCategoryDropdownOpen.set(false);
                return [...current, category];
            }
        });
    }

    removeSelectedCategory(categoryId: number) {
        this.selectedCategories.update(current => current.filter(c => c.id !== categoryId));
    }

    handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files || []) as File[];

        if (this.maxImagesReached()) {
            input.value = '';
            return;
        }

        const currentImages = this.uploadedImages();
        let uniqueFiles = [...currentImages];

        for (const file of files) {
            const isDuplicate = currentImages.some(img => img.name === file.name);
            if (!isDuplicate && uniqueFiles.length < 4) {
                uniqueFiles.push(file);
            }
        }
        this.uploadedImages.set(uniqueFiles);
        input.value = '';
    }

    removeImage(index: number) {
        this.uploadedImages.update(current => {
            const newFiles = [...current];
            newFiles.splice(index, 1);
            return newFiles;
        });
    }

    onSubmit() {
        if (this.productForm.invalid || this.selectedCategories().length === 0 || this.uploadedImages().length === 0) {
            this.notification.warning('Please fill all required fields');
            this.productForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const formData = new FormData();
        formData.append('name', this.productForm.get('name')?.value);
        formData.append('description', this.productForm.get('description')?.value || '');
        formData.append('price', this.productForm.get('price')?.value);

        // Append Category IDs
        // Note: Backend might expect multiple fields with same name or JSON string. 
        // Using multiple fields is standard for arrays in FormData.
        this.selectedCategories().forEach(c => formData.append('categoryIds', c.id.toString()));

        // Append Images
        this.uploadedImages().forEach(file => formData.append('files', file));

        this.productService.createProduct(formData)
            .subscribe({
                next: () => {
                    this.notification.success('Product created successfully');
                    this.router.navigate(['/admin/products']);
                },
                error: (err) => {
                    this.notification.error('Failed to create product');
                    this.isLoading.set(false);
                }
            });
    }
}