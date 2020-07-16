import { Component, OnInit, ElementRef, AfterViewInit, Renderer2, Inject, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { TweenMax as TM } from 'gsap/all'
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { eventDetails, EventDetails } from 'src/app/models/event-details';
declare var particlesJS: any;
@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    animations: [
        trigger('listVisibleState', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('700ms', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('500ms', style({ opacity: 0 })),
            ]),
        ]),
        trigger('titleVisibleState', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('700ms', style({ opacity: .1 })),
            ]),
            transition(':leave', [
                style({ opacity: .1 }),
                animate('500ms', style({ opacity: 0 })),
            ]),
        ]),
    ]
})
export class EventsComponent implements OnInit, AfterViewInit {
    eventBody: any;
    eventText: any;
    progressElement: any;
    titleElement: any;
    idx: number = 0;
    Scroll: any
    subject$: Subject<void> = new Subject<void>();
    toggleView: boolean;
    selectedImageID: any;
    animationState: AnimationState = AnimationState.NoState;
    isAnimationInProgress: boolean;
    images: any;
    slideShowElements: any;
    addedElement: any;
    eventDetails: EventDetails[];


    constructor(private resolver: ComponentFactoryResolver, private elementRef: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document,
        private location: ViewContainerRef) {
        this.eventDetails = eventDetails;
    }
    ngOnInit() {
        particlesJS.load('particles-js', 'assets/data/particles.json', function() { console.log('callback - particles.js config loaded'); });

        //Change Background Color after every 4seconds
        interval(4000).pipe(takeUntil(this.subject$)).subscribe(data => {
            this.changeBackgroundColor();
        })
      }

    ngAfterViewInit() {
        //Get elements from element Ref
        this.images = this.elementRef.nativeElement.querySelectorAll(".tile__img");
        this.slideShowElements = this.elementRef.nativeElement.querySelectorAll(".slideshow-list__el");
        var ele = this.elementRef.nativeElement.querySelectorAll(".page-title ");;
    }

    //CSS has properties declared using them to change bg and text color -- IDX increments
    changeBackgroundColor() {
        this.idx++;
        this.document.querySelector(":root").style.setProperty('--color-bg', `var(--color-bg${(this.idx % 5) + 1})`);
        this.document.querySelector(":root").style.setProperty('--color-text', `var(--color-text${(this.idx % 5) + 1})`);
        
    }

    // Used to update the scroll div
    onScroll(event) {
        this.progressElement = this.elementRef.nativeElement.querySelector(".slideshow__progress");
        this.titleElement = this.elementRef.nativeElement.querySelector(".page-title");
        let scrolledPosition = (event.target as HTMLElement).scrollLeft;
        let fullScreenWidth = window.innerWidth;
        const progress = this.map(scrolledPosition / fullScreenWidth * 100, 0, 100, 10, 100)
        TM.to(this.titleElement, 0.1, { x: -scrolledPosition / fullScreenWidth * 100, force3D: true })
        TM.to(this.progressElement, 0.3, { xPercent: progress, force3D: true })
    }

    //caluclate the progress
    map(value, min1, max1, min2, max2) {
        return Math.min(min2 + (max2 - min2) * (value - min1) / (max1 - min1), 100);
    }

    //On image click creates eventdetail component and toggles the current list
    onImageClick(ImageId) {
        this.toggleView = !this.toggleView;
        this.selectedImageID = ImageId;
        this.addedElement = this.slideShowElements[ImageId];
    }

    //toggle flag flipped- hides the details view
    hideDetailsView() {
        this.toggleView = !this.toggleView;
    }


    //Complete all the Obsevables subscribed-to [EventsComponent]
    ngOnDestroy() {
        this.subject$.next();
        this.subject$.complete();
    }
}

export enum AnimationState {
    NoState,
    Processing,
    Completed
} 
