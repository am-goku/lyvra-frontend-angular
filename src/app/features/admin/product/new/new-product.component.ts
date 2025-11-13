import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckIcon, ChevronDownIcon, DollarSignIcon, FileTextIcon, ImageIcon, LucideAngularModule, SaveIcon, SearchIcon, TagIcon, Trash2Icon, TypeIcon, UploadIcon, X } from "lucide-angular";
import { ProductService } from "../../../../core/services/products.service";

interface Category {
    id: number;
    name: string;
    selected: boolean;
}

@Component({
    selector: 'admin-new-product',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './new-product.component.html',
    styleUrls: ['./new-product.component.scss']
})
export class AdminNewProductComponent {

    constructor(private readonly productService: ProductService){};

    // Icons
    icons = {
        upload: UploadIcon,
        type: TypeIcon,
        tag: TagIcon,
        fileText: FileTextIcon,
        dollarSign: DollarSignIcon,
        save: SaveIcon,
        x: X,
        chevronDown: ChevronDownIcon,
        image: ImageIcon,
        check: CheckIcon,
        search: SearchIcon,
        trash: Trash2Icon
    };

    /* ------------------------------------------------------------------ *
     *  SIGNALS – reactive state                                           *
     * ------------------------------------------------------------------ */
    images = signal<File[]>([]); // array of File objects
    name = signal('');
    description = signal('');
    price = signal('');

    // Category handling
    allCategories = signal<Category[]>([
        { id: 1, name: 'Electronics', selected: false },
        { id: 2, name: 'Clothing', selected: false },
        { id: 3, name: 'Home & Garden', selected: false },
        { id: 4, name: 'Sports', selected: false },
        { id: 5, name: 'Books', selected: false },
        { id: 6, name: 'Toys', selected: false },
        { id: 7, name: 'Beauty', selected: false },
        { id: 8, name: 'Food & Beverage', selected: false },
        { id: 9, name: 'Automotive', selected: false },
        { id: 10, name: 'Jewelry', selected: false }
    ]);
    categorySearch = signal('');
    showCategoryDropdown = signal(false);

    // Computed helpers
    filteredCategories = computed(() => {
        const term = this.categorySearch().toLowerCase();
        return this.allCategories().filter(c => c.name.toLowerCase().includes(term));
    });

    selectedCategories = computed(() =>
        this.allCategories().filter(c => c.selected)
    );

    hasImages = computed(() => this.images().length > 0);
    hasAtLeastOneCategory = computed(() => this.selectedCategories().length > 0);

    /* ------------------------------------------------------------------ *
     *  IMAGE HANDLING                                                    *
     * ------------------------------------------------------------------ */
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const newFiles = Array.from(input.files);
        this.images.update(arr => [...arr, ...newFiles]);
        input.value = ''; // Clear input
    }

    removeImage(idx: number) {
        this.images.update(arr => {
            const copy = [...arr];
            copy.splice(idx, 1);
            return copy;
        });
    }

    // Generate preview URL for image files
    getImagePreview(file: File): string {
        return URL.createObjectURL(file);
    }

    /* ------------------------------------------------------------------ *
     *  CATEGORY HANDLING                                                 *
     * ------------------------------------------------------------------ */
    toggleCategory(id: number) {
        this.allCategories.update(cats =>
            cats.map(c => (c.id === id ? { ...c, selected: !c.selected } : c))
        );
    }

    removeSelectedCategory(id: number) {
        this.allCategories.update(cats =>
            cats.map(c => (c.id === id ? { ...c, selected: false } : c))
        );
    }

    /* ------------------------------------------------------------------ *
     *  FORM VALIDATION (client-side only)                               *
     * ------------------------------------------------------------------ */
    nameError = computed(() => !this.name() ? 'Name is required' : '');
    priceError = computed(() => !this.price() ? 'Price is required' : '');
    imagesError = computed(() => !this.hasImages() ? 'At least one image is required' : '');
    categoryError = computed(() => !this.hasAtLeastOneCategory() ? 'Select at least one category' : '');

    async onSubmit() {
        // Force recompute of errors
        this.nameError();
        this.priceError();
        this.imagesError();
        this.categoryError();

        // If any error → stop
        if (
            this.nameError() || this.priceError() ||
            this.imagesError() || this.categoryError()
        ) {
            return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('name', this.name());
        if (this.description()) {
            formData.append('description', this.description());
        }
        formData.append('price', this.price().toString());
        formData.append('categoryIds', JSON.stringify(this.selectedCategories().map(c => c.id)));
        
        // Append each image file
        this.images().forEach((file, index) => {
            formData.append(`images`, file);
        });

        try {
            // const response = await this.mockApi(formData);
            this.productService.createProduct(formData).subscribe({
                next(value) {
                    console.log('upload success', value)
                },
                error(err) {
                    console.warn('upload failed', err)
                },

            })
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to save product.');
        }
    }
}