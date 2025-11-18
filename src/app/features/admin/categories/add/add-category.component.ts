import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    FileTextIcon,
    LucideAngularModule,
    SaveIcon,
    TagIcon,
    ToggleLeftIcon,
    Trash2Icon,
    X
} from "lucide-angular";
import { CategoryService } from "../../../../core/services/category.service";

@Component({
    selector: 'app-add-category',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {

    constructor(private readonly categoryService: CategoryService) { }

    // Icons
    icons = {
        save: SaveIcon,
        x: X,
        tag: TagIcon,
        fileText: FileTextIcon,
        toggleLeft: ToggleLeftIcon,
        trash: Trash2Icon
    };

    // State
    name = signal('');
    description = signal('');
    active = signal(true);

    imageFile = signal<File | null>(null);
    imagePreview = signal<string | null>(null);
    imageError = signal('');

    // Validation
    nameError = computed(() =>
        !this.name().trim() ? 'Category name is required' : ''
    );

    descriptionError = computed(() =>
        !this.description().trim() ? 'Description is required' : ''
    );

    // When a file is chosen
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        this.imageError.set('');
        this.imagePreview.set(null);
        this.imageFile.set(null);

        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            this.imageError.set('Only image files are allowed');
            return;
        }

        // (Optional) Validate size max 2MB
        if (file.size > 2 * 1024 * 1024) {
            this.imageError.set('Image must be less than 2MB');
            return;
        }

        this.imageFile.set(file);

        // Set preview
        const reader = new FileReader();
        reader.onload = () => this.imagePreview.set(reader.result as string);
        reader.readAsDataURL(file);
    }

    removeImage() {
        this.imageFile.set(null);
        this.imagePreview.set(null);
        this.imageError.set('');
    }

    onSubmit() {
        const nameErr = this.nameError();
        const descErr = this.descriptionError();
        const imgErr = this.imageError();

        if (nameErr || descErr || imgErr) return;

        const formData = new FormData();
        formData.append('name', this.name().trim());
        formData.append('description', this.description().trim());
        formData.append('active', String(this.active()));

        if (this.imageFile()) {
            formData.append('image', this.imageFile()!);
        }

        this.categoryService.createCategory(formData).subscribe({
            next: (res) => {
                console.log('Category created successfully', res);

                // Reset
                this.name.set('');
                this.description.set('');
                this.active.set(true);
                this.imageFile.set(null);
                this.imagePreview.set(null);
            },
            error: (err) => {
                console.error('Error creating category', err);
            }
        });
    }
}
