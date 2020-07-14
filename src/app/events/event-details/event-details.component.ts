import { Component, OnInit, ElementRef, Renderer2, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TweenMax as TM, Power2, Power3 } from 'gsap/all'
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { eventDetails, EventDetails } from '../../models/event-details';
import * as _ from 'lodash';

@Component({
    selector: 'event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.css'],
    animations: [
        trigger('button', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0)' }),
                animate('1000ms', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ]
})
export class EventDetailsComponent implements OnInit, AfterViewInit {

    @Input("imageElement") imageElementRef: any;
    @Input("imageId") imageId: number;
    @Output() changeTheToggle = new EventEmitter();
    addedElement: any;
    subject$: Subject<void> = new Subject<void>();
    eventDetails: EventDetails[];

    constructor(private elementRef: ElementRef,
        private renderer: Renderer2) {
        this.eventDetails = eventDetails;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        //Trigger Animations
        this.animateTextInit();
        this.animateImageInit();
    }

    //Destory Animations Called
    //emits event to hide the component
    onBackClick() {
        this.animateTextDestory();
        this.animateButtonDestroy();
        this.animateImageDestroy();
        interval(800).pipe(takeUntil(this.subject$)).subscribe(data => {
            this.changeTheToggle.emit();
        })
    }

    //Text Animations on Destory - moves In from bottom to top
    //TweenMax Animation to give bottm to top animation for title
    animateTextInit() {
        let detailViewTitles = this.elementRef.nativeElement.querySelectorAll(".detail-view__title");
        let detailViewText = this.elementRef.nativeElement.querySelector("p");

        _.forEach(detailViewTitles, detailViewTitle => {
            TM.staggerFromTo(detailViewTitle, 1.5, {
                yPercent: 100,
            }, {
                yPercent: 0,
                ease: Power3.easeInOut,
                force3D: true,
            }, 0.5 / detailViewTitle.length);
        });
        TM.staggerFromTo(detailViewText, 1.5, {
            yPercent: 100,
        }, {
            yPercent: 0,
            ease: Power3.easeInOut,
            force3D: true,
        }, 0.5 / detailViewText.length)
    }

    //Text Animations on Destory - fades out in downward direction
    //TweenMax Animation to give bottm to top animation for title
    animateTextDestory() {
        let detailViewTitles = this.elementRef.nativeElement.querySelectorAll(".detail-view__title");
        let detailViewText = this.elementRef.nativeElement.querySelector("p");

        _.forEach(detailViewTitles, detailViewTitle => {
            TM.staggerFromTo(detailViewTitle, 0.8, {
                yPercent: 0,
                opacity: 1
            }, {
                yPercent: 100,
                opacity: 0,
                ease: Power3.easeInOut,
                force3D: true,
            }, 0.5 / detailViewTitle.length);
        });

        TM.staggerFromTo(detailViewText, 0.8, {
            yPercent: 0,
            opacity: 1
        }, {
            yPercent: 100,
            opacity: 0,
            ease: Power3.easeInOut,
            force3D: true,
        }, 0.5 / detailViewText.length)
    }

    //Button Animations on Destroy - fades out with Scaling
    animateButtonDestroy() {
        let closeButton = this.elementRef.nativeElement.querySelector(".close-detail");
        TM.staggerFromTo(closeButton, 0.8, {
            opacity: 1,
            scale: 1,
        }, {
            opacity: 0,
            scale: 0,
            ease: Power3.easeInOut,
            force3D: true,
        })
    }

    //Image Animation Effect on Init
    animateImageInit() {
        let img = this.elementRef.nativeElement.querySelector(".tile__img_details_View");
        TM.staggerFromTo(img, 1, {
            opacity: 0,
            scale: 0,
        }, {
            opacity: 1,
            scale: 1,
            ease: Power3.easeIn,
            transform: "translateX(100%)",
            force3D: true,
        })
    }

    //Image Animation Effect on Destory
    animateImageDestroy() {
        let img = this.elementRef.nativeElement.querySelector(".tile__img_details_View");
        TM.staggerFromTo(img, 0.8, {
            opacity: 1,
            scale: 1,
        }, {
            opacity: 0,
            scale: 0,
            transform: "translateX(20%)",
            ease: Power3.easeInOut,
            force3D: true,
        })
    }

    //Complete all the Obsevables subscribed-to [EventsDetailsComponent]
    ngOnDestroy() {
        this.subject$.next();
        this.subject$.complete();
    }

}
