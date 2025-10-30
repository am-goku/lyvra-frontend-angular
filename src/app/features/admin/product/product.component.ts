import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckIcon, ChevronDownIcon, DollarSignIcon, FileTextIcon, ImageIcon, LinkIcon, LucideAngularModule, PackageIcon, SaveIcon, SearchIcon, TagIcon, ToggleLeftIcon, Trash2Icon, TypeIcon, UploadIcon, X } from "lucide-angular";

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

interface ProductImage {
  dataUrl: string;   // base64 or remote URL
  isDefault: boolean;
  isUrl: boolean;    // true → remote URL, false → uploaded file
}

@Component({
    selector: 'admin-product',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class AdminProductComponent {
  // Icons
  icons = {
    upload: UploadIcon,
    link: LinkIcon,
    type: TypeIcon,
    tag: TagIcon,
    fileText: FileTextIcon,
    dollarSign: DollarSignIcon,
    package: PackageIcon,
    toggleLeft: ToggleLeftIcon,
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
  imageSource = signal<'upload' | 'url'>('upload');
  images = signal<ProductImage[]>([]);               // all images
  defaultImageIndex = signal<number>(0);             // index of default

  title = signal('');
  description = signal('');
  price = signal('');
  stock = signal('');
  available = signal(true);

  // Category handling
  allCategories = signal<Category[]>([
    { id: '1', name: 'Electronics', selected: false },
    { id: '2', name: 'Clothing', selected: false },
    { id: '3', name: 'Home & Garden', selected: false },
    { id: '4', name: 'Sports', selected: false },
    { id: '5', name: 'Books', selected: false },
    { id: '6', name: 'Toys', selected: false },
    { id: '7', name: 'Beauty', selected: false },
    { id: '8', name: 'Food & Beverage', selected: false },
    { id: '9', name: 'Automotive', selected: false },
    { id: '10', name: 'Jewelry', selected: false }
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

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImg: ProductImage = {
          dataUrl: reader.result as string,
          isDefault: this.images().length === 0, // first image → default
          isUrl: false
        };
        this.images.update(arr => [...arr, newImg]);
        if (this.images().length === 1) this.defaultImageIndex.set(0);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  addImageUrl(url: string) {
    if (!url.trim()) return;
    const newImg: ProductImage = {
      dataUrl: url,
      isDefault: this.images().length === 0,
      isUrl: true
    };
    this.images.update(arr => [...arr, newImg]);
    if (this.images().length === 1) this.defaultImageIndex.set(0);
    this.tempUrl = '';
  }

  removeImage(idx: number) {
    this.images.update(arr => {
      const copy = [...arr];
      copy.splice(idx, 1);
      // re-assign default if needed
      if (copy.length === 0) return copy;
      if (this.defaultImageIndex() === idx) {
        this.defaultImageIndex.set(0);
      } else if (this.defaultImageIndex() > idx) {
        this.defaultImageIndex.update(v => v - 1);
      }
      return copy;
    });
  }

  setDefault(idx: number) {
    this.defaultImageIndex.set(idx);
  }

  tempUrl = ''; // bound to URL input field

  /* ------------------------------------------------------------------ *
   *  CATEGORY HANDLING                                                 *
   * ------------------------------------------------------------------ */
  toggleCategory(id: string) {
    this.allCategories.update(cats =>
      cats.map(c => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  }

  removeSelectedCategory(id: string) {
    this.allCategories.update(cats =>
      cats.map(c => (c.id === id ? { ...c, selected: false } : c))
    );
  }

  /* ------------------------------------------------------------------ *
   *  FORM VALIDATION (client-side only)                               *
   * ------------------------------------------------------------------ */
  titleError = computed(() => !this.title() ? 'Title is required' : '');
  descError = computed(() => !this.description() ? 'Description is required' : '');
  priceError = computed(() => !this.price() ? 'Price is required' : '');
  stockError = computed(() => !this.stock() ? 'Stock is required' : '');
  imagesError = computed(() => !this.hasImages() ? 'At least one image (upload or URL) is required' : '');
  categoryError = computed(() => !this.hasAtLeastOneCategory() ? 'Select at least one category' : '');

  /* ------------------------------------------------------------------ *
   *  MOCK API                                                          *
   * ------------------------------------------------------------------ */
  async mockApi(payload: any) {
    // simulate network delay
    await new Promise(r => setTimeout(r, 800));
    console.log('MOCK API payload →', payload);
    alert('Product saved! (check console)');
  }

  async onSubmit() {
    // force recompute of errors
    this.titleError();
    this.descError();
    this.priceError();
    this.stockError();
    this.imagesError();
    this.categoryError();

    // if any error → stop
    if (
      this.titleError() || this.descError() || this.priceError() ||
      this.stockError() || this.imagesError() || this.categoryError()
    ) {
      return;
    }

    const payload = {
      title: this.title(),
      description: this.description(),
      price: Number(this.price()),
      stock: Number(this.stock()),
      available: this.available(),
      categoryIds: this.selectedCategories().map(c => c.id),
      // separate arrays – backend can decide which to use
      images: this.images().filter(i => !i.isUrl).map(i => i.dataUrl),
      imageUrls: this.images().filter(i => i.isUrl).map(i => i.dataUrl),
      defaultImageIndex: this.defaultImageIndex()
    };

    await this.mockApi(payload);
  }
}