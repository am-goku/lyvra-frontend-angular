import { Component, input } from "@angular/core";
import { LucideAngularModule, StarIcon } from "lucide-angular";
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { NgClass } from "@angular/common";

@Component({
    selector: 'product-review-section',
    standalone: true,
    imports: [LucideAngularModule, ɵInternalFormsSharedModule, FormsModule, NgClass],
    templateUrl: './review.component.html'
})

export class ProductReviewComponent {

    StarIcon = StarIcon;
    canReview = input(false);

    reviews = [
        { id: 1, user: 'Ananya Sharma', date: 'Oct 10, 2025', rating: 5, comment: 'Loved the fabric and fit!' },
        { id: 2, user: 'Karan Patel', date: 'Oct 8, 2025', rating: 4, comment: 'Very comfortable, just a bit long.' },
    ];

    newReview = {
        user: '',
        rating: 0,
        comment: '',
        date: 'Oct 8, 2025'
    };

    setRating = (r: number) => this.newReview.rating = r

    submitReview = () => {
        const { comment, rating, user } = this.newReview;
        if (!comment || !user || !rating) throw Error('Fill all fields')
        console.log(this.newReview)
        this.reviews = [
            {
                id: this.reviews.length + 1,
                ...this.newReview
            },
            ...this.reviews
        ]
    }

};