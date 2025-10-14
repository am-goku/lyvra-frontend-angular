import { NgClass } from "@angular/common";
import { Component } from "@angular/core";
import { ChevronLeftIcon, ChevronRightIcon, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'hero-carousel',
    standalone: true,
    imports: [LucideAngularModule, NgClass],
    templateUrl: './carousel.component.html',
})

export class HeroCarousel {
    // Sample carousel map
    sampleCarousel = [1, 2, 3];
    currentSlide = 1;

    ChevronLeft = ChevronLeftIcon;
    ChevronRight = ChevronRightIcon;

    prevSlide() {
        if (this.currentSlide === 1) this.currentSlide = this.sampleCarousel[this.sampleCarousel.length - 1];
        else this.currentSlide = this.currentSlide - 1;
    }

    nextSlide() {
        if (this.currentSlide === 3) this.currentSlide = this.sampleCarousel[0];
        else this.currentSlide = this.currentSlide + 1;
    }
};