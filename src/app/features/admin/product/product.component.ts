import { ChangeDetectionStrategy, Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

// --- Interfaces for Product Data Structure ---

interface Product {
  id: number;
  name: string;
  category: 'Electronics' | 'Apparel' | 'Home Goods' | 'Books';
  price: number;
  stock: number;
  sales: number;
  isListed: boolean;
  imageUrl: string;
  description: string;
  specs: string[];
}

interface SortState {
  column: keyof Product | '';
  direction: 'asc' | 'desc';
}

// --- Utility Functions for Mock Data ---

function getMockProducts(): Product[] {
  const categories: Product['category'][] = ['Electronics', 'Apparel', 'Home Goods', 'Books'];
  const data: Product[] = [];

  for (let i = 1; i <= 25; i++) {
    const category = categories[i % categories.length];
    const isListed = Math.random() > 0.3;

    data.push({
      id: i,
      name: `Product ${i}: ${category} Item`,
      category,
      price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 500),
      sales: Math.floor(Math.random() * 2000),
      isListed: isListed,
      imageUrl: `https://placehold.co/80x80/2980b9/ffffff?text=P${i}`,
      description: `A detailed description for Product ${i}. This item is essential for all your ${category.toLowerCase()} needs.`,
      specs: [`Weight: ${Math.floor(Math.random() * 10)}kg`, `Material: Durable Polymer`, `Warranty: 1 Year`],
    });
  }
  return data;
}

// --- Product Dashboard Component ---

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductComponent implements OnInit {
  // --- State Signals ---
  allProducts = signal<Product[]>([]);
  searchTerm = signal<string>('');
  filterCategory = signal<string>('all');
  sortState = signal<SortState>({ column: 'name', direction: 'asc' });
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  selectedProducts = signal<number[]>([]); // Array of selected product IDs
  
  // Modal state
  isModalOpen = signal<boolean>(false);
  // Holds the product data currently being edited/viewed in the modal.
  editingProduct = signal<Product | null>(null);

  // Table columns for rendering and sorting
  columns = [
    { key: 'name', label: 'Product' },
    { key: 'stock', label: 'Stock' },
    { key: 'price', label: 'Price' },
    { key: 'sales', label: 'Sales' },
  ];

  // --- Initialization ---
  ngOnInit(): void {
    this.allProducts.set(getMockProducts());
  }

  // --- Filtering & Sorting Logic (Computed Signals) ---

  /** Filters products based on search term and category. */
  filteredProducts = computed(() => {
    const products = this.allProducts();
    const term = this.searchTerm().toLowerCase();
    const category = this.filterCategory();
    const sort = this.sortState();

    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(term) || p.id.toString().includes(term);
      const matchesCategory = category === 'all' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    // Sorting Logic
    const column = sort.column;
    if (column) {
      result.sort((a, b) => {
        const valA = a[column] as any;
        const valB = b[column] as any;
        
        let comparison = 0;
        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;
        
        return sort.direction === 'asc' ? comparison : comparison * -1;
      });
    }

    // Reset page to 1 after filtering/sorting if the current page becomes invalid
    if (this.currentPage() > 1 && result.length <= (this.currentPage() - 1) * this.pageSize()) {
        // Use setTimeout to avoid side-effects during signal computation
        setTimeout(() => this.currentPage.set(1), 0);
    }

    return result;
  });

  /** Calculates total number of pages. */
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize());
  });

  /** Gets the products for the current page. */
  pagedProducts = computed(() => {
    const products = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return products.slice(start, end);
  });
  
  /** Calculates the range of products currently displayed for the pagination text. */
  displayRange = computed(() => {
    const currentProducts = this.filteredProducts();
    const total = currentProducts.length;
    
    if (total === 0) {
        return { start: 0, end: 0, total: 0 };
    }
    
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    
    return { start, end, total };
  });

  // --- Table & Filter Handlers ---

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1); // Reset page on search
  }

  onFilter(event: Event) {
    this.filterCategory.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1); // Reset page on filter
  }

  setSort(column: keyof Product) {
    this.sortState.update(currentSort => {
      if (currentSort.column === column) {
        // Toggle direction if same column is clicked
        return { column, direction: currentSort.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // Default to ascending if new column is clicked
        return { column, direction: 'asc' };
      }
    });
    this.currentPage.set(1); // Reset page after sort
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // --- Selection & Bulk Action Handlers ---

  areAllSelected = computed(() => {
    const currentProductIds = this.pagedProducts().map(p => p.id);
    return currentProductIds.length > 0 && currentProductIds.every(id => this.selectedProducts().includes(id));
  });

  isIndeterminate = computed(() => {
    const selectedCount = this.selectedProducts().length;
    const allCount = this.pagedProducts().length;
    return selectedCount > 0 && selectedCount < allCount;
  });

  toggleProductSelection(id: number) {
    this.selectedProducts.update(ids => {
      const index = ids.indexOf(id);
      if (index > -1) {
        ids.splice(index, 1); // Deselect
      } else {
        ids.push(id); // Select
      }
      return [...ids];
    });
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentProductIds = this.pagedProducts().map(p => p.id);
    
    this.selectedProducts.update(ids => {
      let newIds = [...ids];
      if (isChecked) {
        // Add all current page IDs that are not already selected
        currentProductIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
      } else {
        // Remove all current page IDs from the selection
        newIds = newIds.filter(id => !currentProductIds.includes(id));
      }
      return newIds;
    });
  }

  bulkToggleListing(isListed: boolean) {
    this.allProducts.update(products => {
      const selectedIds = this.selectedProducts();
      console.log(`Bulk action: Setting ${selectedIds.length} products to ${isListed ? 'Listed' : 'Unlisted'}.`);
      return products.map(p => 
        selectedIds.includes(p.id) ? { ...p, isListed: isListed } : p
      );
    });
    this.selectedProducts.set([]); // Clear selection after action
  }

  bulkDelete() {
    const selectedIds = this.selectedProducts();
    console.log(`Bulk action: Deleting ${selectedIds.length} products.`);
    
    this.allProducts.update(products => {
      return products.filter(p => !selectedIds.includes(p.id));
    });
    this.selectedProducts.set([]); // Clear selection after action
  }

  // --- Modal Handlers ---

  openProductModal(product: Product | null) {
    // Deep clone the product object if editing, or create a blank slate for adding
    if (product) {
      this.editingProduct.set({ ...product, specs: [...product.specs] });
    } else {
      // New Product Template
      this.editingProduct.set({
        id: -1, // Temporary ID for new products
        name: 'New Product Name',
        category: 'Electronics',
        price: 0.00,
        stock: 0,
        sales: 0,
        isListed: false,
        imageUrl: 'https://placehold.co/400x400/eeeeee/333333?text=New+Product',
        description: 'Enter a detailed description here.',
        specs: ['Dimensions: TBD', 'Weight: TBD'],
      });
    }
    this.isModalOpen.set(true);
  }

  closeProductModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  updateModalField(key: keyof Product, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    let value: string | number | boolean = target.value;

    // Type coercion for numeric fields
    if (key === 'price' || key === 'stock') {
      value = parseFloat(target.value) || 0;
    }
    
    this.editingProduct.update(p => p ? { ...p, [key]: value } as Product : null);
  }

  saveProductChanges() {
    const productToSave = this.editingProduct();
    if (!productToSave) return;

    this.allProducts.update(products => {
      if (productToSave.id === -1) {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        console.log(`Adding new product with ID: ${newId}`);
        return [...products, { ...productToSave, id: newId }];
      } else {
        // Update existing product
        console.log(`Updating product ID: ${productToSave.id}`);
        return products.map(p => (p.id === productToSave.id) ? productToSave : p);
      }
    });
    this.closeProductModal();
  }

  deleteProduct(id: number) {
    console.log(`Product ID ${id} deleted.`);
    this.allProducts.update(products => products.filter(p => p.id !== id));
    this.closeProductModal(); // Ensure modal closes if delete was from modal
    this.selectedProducts.set(this.selectedProducts().filter(selectedId => selectedId !== id)); // Remove from selection
  }
  
  toggleListing(product: Product) {
    this.allProducts.update(products => {
      console.log(`Toggling listing status for product ID: ${product.id}`);
      return products.map(p => (p.id === product.id) ? { ...p, isListed: !p.isListed } : p);
    });
    // Also update the modal's internal state immediately
    this.editingProduct.update(p => p ? { ...p, isListed: !p.isListed } : null);
  }
}