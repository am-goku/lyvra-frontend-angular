import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { LucideAngularModule, XIcon } from 'lucide-angular';

// --- Inline SVG Icons (Replacing Lucide Angular) ---

const SVG_ICONS = {
    // Used in Header
    Package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 mr-3 text-indigo-600"><path d="m7.5 4.27 9 5.15"/><path d="m21 8.27-9-5.15-9 5.15"/><path d="m3.27 12 9 5.15 9-5.15"/><path d="M12 22V17.3"/><path d="M3.27 12v5.15"/><path d="M21 12v5.15"/></svg>`,
    // Used for Product Name input
    Tag: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><path d="M12.586 10.914 19 4.5l-2-2L14.086 7.414"/><path d="M15 16l-1 1l-2-2l1-1"/><path d="M21 12V3h-9L2 12l10 10z"/></svg>`,
    // Used for Price input
    DollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    // Used for Categories section header
    Tags: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-indigo-500"><path d="M2 3h1.3c.7 0 1.4.3 1.7 1C6.2 6 7 7.5 7 9c0 1.5-1 3-2.7 3.5L3 13.5v7.5"/><path d="M19 3h1.3c.7 0 1.4.3 1.7 1C23.2 6 24 7.5 24 9c0 1.5-1 3-2.7 3.5L20 13.5v7.5"/><path d="M7 3h1.3c.7 0 1.4.3 1.7 1C11.2 6 12 7.5 12 9c0 1.5-1 3-2.7 3.5L8 13.5v7.5"/></svg>`,
    // Used for Category Search input
    Search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    // Used as a checkmark in the Categories dropdown
    Check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-indigo-600"><polyline points="20 6 9 17 4 12"/></svg>`,
    // Used to remove categories/images
    X: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`,
    // Used for Images section header and file input area
    ImagePlus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" y1="5" x2="22" y2="5"/><line x1="19" y1="2" x2="19" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    // Used for loading spinner on submit button
    Loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`
};

// --- Interfaces and Mock Data ---

/** Interface for the Category model */
interface Category {
    id: string;
    name: string;
}

/** Interface for the primary form data structure */
interface ProductForm {
    name: string;
    description: string | null;
    price: number | null;
}

/** Interface for the mock API response */
interface CreateProductResponse {
    success: boolean;
    message: string;
    productId?: string;
}

/** Mock Category Data */
const mockCategories: Category[] = [
    { id: 'cat_001', name: 'Electronics' },
    { id: 'cat_002', name: 'Apparel' },
    { id: 'cat_003', name: 'Home Goods' },
    { id: 'cat_004', name: 'Books' },
    { id: 'cat_005', name: 'Sports & Outdoors' },
    { id: 'cat_006', name: 'Toys & Games' },
    { id: 'cat_007', name: 'Automotive' },
    { id: 'cat_008', name: 'Health & Beauty' },
    { id: 'cat_009', name: 'Office Supplies' },
    { id: 'cat_010', name: 'Jewelry' },
];

// --- Mock API Service Functions ---

/** Simulates fetching all available categories from a backend. */
const getMockCategories = (): Promise<Category[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockCategories), 500);
    });
};

/** Simulates product creation API call. */
const createProductMockApi = (productData: any): Promise<CreateProductResponse> => {
    console.log('--- Mock API Payload ---', productData);
    return new Promise(resolve => {
        setTimeout(() => {
            if (Math.random() < 0.9) { // 90% success rate
                resolve({
                    success: true,
                    message: 'Product created successfully!',
                    productId: `prod_${Date.now()}`
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to connect to inventory service. Please try again.'
                });
            }
        }, 1500);
    });
};

@Component({
    selector: 'app-root',
    templateUrl: './new-product.component.html',
    styleUrls: ['./new-product.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNewProductComponent implements OnInit {
    isFormSubmitted() {
        throw new Error('Method not implemented.');
    }
    // Expose SVGs to the template
    protected SVG_ICONS = SVG_ICONS;
    private fb = inject(FormBuilder);

    // --- State Signals ---
    categoryOptions = signal<Category[]>([]);
    selectedCategories = signal<Category[]>([]);
    uploadedImages = signal<File[]>([]);
    isLoading = signal(false);
    statusMessage = signal('');
    isSuccess = signal(true);

    // State for Category Search Dropdown
    categorySearchTerm = signal('');
    isCategoryDropdownOpen = signal(false);

    // Lucide icons
    XIcon = XIcon;

    // --- Computed State ---
    // Filters category options based on the search term and excludes already selected ones.
    filteredCategories = computed(() => {
        const term = this.categorySearchTerm().toLowerCase();
        const selectedIds = this.selectedCategories().map(c => c.id);

        return this.categoryOptions()
            .filter(cat => !selectedIds.includes(cat.id))
            .filter(cat => cat.name.toLowerCase().includes(term));
    });

    // New computed signal to check if the max limit is reached
    maxImagesReached = computed(() => this.uploadedImages().length >= 4);

    // --- Reactive Form Setup ---
    productForm: FormGroup = this.fb.group({
        name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(100)], nonNullable: true }),
        description: this.fb.control<string | null>(null),
        price: this.fb.control<number | null>(null, { validators: [Validators.required, Validators.min(0.01)], nonNullable: false }),
    });

    // --- Lifecycle Hook ---
    ngOnInit() {
        this.loadCategories();

        // FIX: Removed the injector option from effect() as it is correctly called in the creation context (ngOnInit).
        effect(() => {
            // Whenever selectedCategories changes, reset the search term.
            // Reading the signal here makes the effect re-run when the signal updates.
            this.selectedCategories();
            this.categorySearchTerm.set('');
        });
    }

    // --- Data Loading ---
    async loadCategories() {
        try {
            this.categoryOptions.set(await getMockCategories());
        } catch (e) {
            console.error('Failed to load categories', e);
        }
    }

    // --- Category Handlers ---
    isSelected(categoryId: string): boolean {
        return this.selectedCategories().some(c => c.id === categoryId);
    }

    toggleCategory(category: Category) {
        this.selectedCategories.update(current => {
            if (current.some(c => c.id === category.id)) {
                // Remove category
                return current.filter(c => c.id !== category.id);
            } else {
                // Add category and close dropdown
                this.isCategoryDropdownOpen.set(false);
                return [...current, category];
            }
        });
    }

    removeSelectedCategory(categoryId: string) {
        this.selectedCategories.update(current =>
            current.filter(c => c.id !== categoryId)
        );
    }

    // --- Image Handlers ---
    handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files || []) as File[]; // Ensure files array is typed as File[]

        // Guard against uploading if max is already reached (though the input is disabled, this is a final check)
        if (this.maxImagesReached()) {
            input.value = ''; // Clear input if accidentally triggered
            return;
        }

        const currentImages = this.uploadedImages();
        let uniqueFiles = [...currentImages];

        // Add new files, respecting the 4 image limit
        for (const file of files) {
            // Basic uniqueness check by file name (not robust but sufficient for mock)
            const isDuplicate = currentImages.some(img => img.name === file.name);

            if (!isDuplicate && uniqueFiles.length < 4) {
                uniqueFiles.push(file);
            } else if (uniqueFiles.length >= 4) {
                // Stop adding once the limit is reached
                this.statusMessage.set('Maximum 4 images allowed. Cannot upload more.');
                this.isSuccess.set(false);
                break;
            }
        }

        if (uniqueFiles.length > 0 && uniqueFiles.length <= 4) {
            this.uploadedImages.set(uniqueFiles);
            this.statusMessage.set('');
        } else if (uniqueFiles.length === 0 && files.length > 0) {
            // This should only happen if all attempted files were duplicates and no initial images existed, 
            // but we set to the result of the logic.
            this.uploadedImages.set([]);
            this.statusMessage.set('');
        }

        // Reset the file input value to allow the same file to be selected again after removal
        input.value = '';
    }

    removeImage(index: number) {
        this.uploadedImages.update(current => {
            const newFiles = [...current];
            newFiles.splice(index, 1);
            return newFiles;
        });
        // Clear any previous status message related to the limit when an image is removed
        this.statusMessage.set('');
    }

    // --- Submission ---
    async onSubmit() {
        this.productForm.markAllAsTouched();

        // Custom validation for Categories (required 1+)
        const categoriesValid = this.selectedCategories().length > 0;
        if (!categoriesValid) {
            this.productForm.setErrors({ 'categoriesRequired': true });
        }

        // Custom validation for Images (required 1-4)
        const imagesValid = this.uploadedImages().length >= 1 && this.uploadedImages().length <= 4;
        if (!imagesValid) {
            this.productForm.setErrors({ 'imagesInvalid': true });
        }

        // If any validation fails (including standard form controls)
        if (this.productForm.invalid || !categoriesValid || !imagesValid) {
            this.statusMessage.set('Please fix the required fields and image count (1-4).');
            this.isSuccess.set(false);
            return;
        }

        // Clear custom errors if valid
        this.productForm.setErrors(null);


        this.isLoading.set(true);
        this.statusMessage.set('');

        // 1. Prepare Payload: Use only category IDs, as requested.
        const payload = {
            ...this.productForm.value,
            // Ensure price is treated as a float/number
            price: parseFloat(this.productForm.value.price as string),
            categoryIds: this.selectedCategories().map(c => c.id), // Only IDs sent to backend
            imageFiles: this.uploadedImages().map(f => ({
                name: f.name,
                size: f.size,
                type: f.type
            })),
        };

        try {
            // 2. Mock API Call
            const response = await createProductMockApi(payload);

            this.isSuccess.set(response.success);
            this.statusMessage.set(response.message);

            if (response.success) {
                // 3. Reset Form on Success
                this.productForm.reset({ name: '', description: null, price: null });
                this.selectedCategories.set([]);
                this.uploadedImages.set([]);
                this.productForm.markAsUntouched();
            }
        } catch (error) {
            this.isSuccess.set(false);
            this.statusMessage.set('An unexpected error occurred during creation.');
            console.error(error);
        } finally {
            this.isLoading.set(false);
        }
    }
}