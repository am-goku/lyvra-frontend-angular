import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckIcon, ChevronDownIcon, DollarSignIcon, FileTextIcon, ImageIcon, LinkIcon, LucideAngularModule, PackageIcon, SaveIcon, TagIcon, ToggleLeftIcon, TypeIcon, UploadIcon, X } from "lucide-angular";

interface Category {
  id: string;
  name: string;
  selected: boolean;
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
    check: CheckIcon
  };

  // Signals
  imageSource = signal<'upload' | 'url'>('upload');
  imagePreview = signal<string>('');
  imageUrl = '';
  title = '';
  description = '';
  price = '';
  stock = '';
  available = signal(true);
  showCategoryDropdown = signal(false);

  categories = signal<Category[]>([
    { id: '1', name: 'Electronics', selected: false },
    { id: '2', name: 'Clothing', selected: false },
    { id: '3', name: 'Home & Garden', selected: false },
    { id: '4', name: 'Sports', selected: false },
    { id: '5', name: 'Books', selected: false },
    { id: '6', name: 'Toys', selected: false },
    { id: '7', name: 'Beauty', selected: false },
    { id: '8', name: 'Food & Beverage', selected: false },
  ]);

  selectedCategories = this.categories().filter(c => c.selected);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  updatePreviewFromUrl() {
    if (this.imageUrl) {
      this.imagePreview.set(this.imageUrl);
    } else {
      this.imagePreview.set('');
    }
  }

  clearImage() {
    this.imagePreview.set('');
    this.imageUrl = '';
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
  }

  toggleCategory(id: string) {
    this.categories.update(cats =>
      cats.map(cat => cat.id === id ? { ...cat, selected: !cat.selected } : cat)
    );
  }

  onSubmit() {
    const selected = this.categories().filter(c => c.selected).map(c => c.name);
    console.log({
      image: this.imagePreview(),
      title: this.title,
      categories: selected,
      description: this.description,
      price: this.price,
      stock: this.stock,
      available: this.available()
    });
  }
}