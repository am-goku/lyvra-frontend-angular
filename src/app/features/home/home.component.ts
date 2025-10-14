import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { HeroCarousel } from './components/carousel/carousel.component';
import { TrendingComponent } from './components/trending/trending.component';
import { CategoryComponent } from './components/categories/categories.component';
import { GenderComponent } from './components/gender/gender.component';
import { DealComponent } from './components/deals/deals.component';
import { RecentComponent } from './components/recent/recent.component';
import { NewsletterComponent } from "./components/newsletter/newsletter.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HeroCarousel,
        TrendingComponent,
        CategoryComponent,
        GenderComponent,
        DealComponent,
        RecentComponent,
        NewsletterComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {

    // -------------------------------
    // Sections Visibility
    // -------------------------------
    sections: boolean[] = [false, false, false, false, false, false, false]; // 7 sections

    // -------------------------------
    // Grab all sections from the template
    // -------------------------------
    @ViewChildren('section0, section1, section2, section3, section4, section5, section6') sectionElements!: QueryList<ElementRef>;

    // -------------------------------
    // Intersection Observer Setup
    // -------------------------------
    ngAfterViewInit(): void {
        this.sectionElements.forEach((section: ElementRef<any>, index: number) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.sections[index] = true; // triggers @if() and animation
                            observer.unobserve(entry.target); // optional: animate only once
                        }
                    });
                },
                { threshold: 0.1 } // trigger when 10% of section is visible
            );

            observer.observe(section.nativeElement);
        });
    }
}
