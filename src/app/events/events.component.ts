import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TweenMax as TM } from 'gsap/all'
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{
    eventBody: any;
    eventText: any;
    progressElement: any;
    titleElement: any;
    idx: number = 0;
    Scroll: any
    subject$: Subject<void> = new Subject<void>();

    constructor(private elementRef: ElementRef) {
    }
    ngOnInit() {
        this.progressElement = this.elementRef.nativeElement.querySelector(".slideshow__progress");
        this.titleElement = this.elementRef.nativeElement.querySelector(".page-title");

        interval(4000).pipe(takeUntil(this.subject$)).subscribe(data => {
            this.changeBackgroundColor();
        })
    }


    changeBackgroundColor() {
        this.eventBody = this.elementRef.nativeElement.querySelector(".event-body");
        this.eventText = this.elementRef.nativeElement.querySelector(".page-title");
        this.idx++;
        this.eventBody.style.setProperty('--color-bg', `var(--color-bg${(this.idx % 5) + 1}`);
        this.eventText.style.setProperty('--color-text', `var(--color-text${(this.idx % 5) + 1}`);
    }

    onScroll(event) {
        let scrolledPosition = (event.target as HTMLElement).scrollLeft;
        let fullScreenWidth = window.innerWidth;
        const progress = this.map(scrolledPosition / fullScreenWidth * 100, 0, 100, 10, 100)
        console.log(progress);
        TM.to(this.titleElement, 0.1, { x: -scrolledPosition / fullScreenWidth * 100, force3D: true })
        TM.to(this.progressElement, 0.3, { xPercent: progress, force3D: true })
    }

    map(value, min1, max1, min2, max2) {
      return Math.min(min2 + (max2 - min2) * (value - min1) / (max1 - min1),100);
    }

    openDataView() {

    }

    ngOnDestroy() {
        this.subject$.next();
        this.subject$.complete();
    }
}
