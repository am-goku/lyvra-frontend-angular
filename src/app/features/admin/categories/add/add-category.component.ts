import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FileTextIcon, LucideAngularModule, SaveIcon, TagIcon, ToggleLeftIcon, X } from "lucide-angular";
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
        toggleLeft: ToggleLeftIcon
    };

    // State
    name = signal('');
    description = signal('');
    active = signal(true);

    // Validation
    nameError = computed(() => !this.name().trim() ? 'Category name is required' : '');
    descriptionError = computed(() => !this.description().trim() ? 'Description is required' : '');


    async onSubmit() {
        // Trigger validation
        const nameErr = this.nameError();
        const descErr = this.descriptionError();

        if (nameErr || descErr) {
            return;
        }

        const payload = {
            name: this.name().trim(),
            description: this.description().trim(),
            active: this.active(),
        };

        this.categoryService.createCategory(payload).subscribe({
            next: (res) => {
                console.log('Category created successfully', res);
                // Reset form fields when the call is successful
                this.name.set('');
                this.description.set('');
                this.active.set(true);
            },
            error: (err) => {
                console.error('Error creating category', err);
            }
        });
    }
}