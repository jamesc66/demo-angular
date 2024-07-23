import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import * as d3 from 'd3';
import {
  updatePlayPauseButton,
  handleDrag,
  handleDragEnd,
  updateSliderWidth,
  startAutoSlide,
  rewind,
  initializeTimeline,
  TimelineData,
  InitD3TimelineParams,
} from './timeline';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  standalone: true,
})
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: TimelineData[] = [];
  @Input() speed: number = 5;
  @Output() dateSelected = new EventEmitter<string>();

  @ViewChild('timeline', { static: false })
  timeline!: ElementRef<HTMLDivElement>;

  private sliderWidth: number = 0;
  private isPlaying: boolean = false;
  private animationFrameRef = { current: 0 };
  private resizeObserver!: ResizeObserver;
  private handleRadius: number = 5;
  private position: number = 0;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeTimeline();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    cancelAnimationFrame(this.animationFrameRef.current);
  }

  private initializeTimeline(): void {
    const selectDate = (type: string, detail: any) => {
      this.dateSelected.emit(detail);
    };

    const params: InitD3TimelineParams = {
      timeline: this.timeline.nativeElement,
      data: this.data,
      handleRadius: this.handleRadius,
      sliderWidth: this.sliderWidth,
      isPlaying: this.isPlaying,
      togglePlay: this.togglePlay.bind(this),
      rewind: () => {
        rewind({
          positionSetter: (value: number) => {
            this.position = value;
            this.updateHandlePosition();
          },
          data: this.data,
          selectDate,
        });
      },
      selectDate,
      speed: this.speed,
      handleDrag: (event) =>
        handleDrag(
          event,
          this.handleRadius,
          this.sliderWidth,
          (value) => {
            this.position = value;
            this.updateHandlePosition();
          },
          this.data,
          selectDate
        ),
      handleDragEnd,
    };

    initializeTimeline(params);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.timeline.nativeElement) {
        updateSliderWidth({
          timeline: this.timeline.nativeElement,
          handleRadius: this.handleRadius,
          setSliderWidth: this.setSliderWidth.bind(this),
        });
      }
    });

    if (this.timeline.nativeElement) {
      this.resizeObserver.observe(this.timeline.nativeElement);
    }
  }

  private setSliderWidth(width: number): void {
    this.sliderWidth = width;
    this.initializeTimeline();
  }

  private updateHandlePosition(): void {
    if (this.timeline.nativeElement) {
      d3.select(this.timeline.nativeElement)
        .select('circle')
        .attr('cx', this.position + this.handleRadius);
    }
  }

  private togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      startAutoSlide({
        data: this.data,
        positionSetter: (value: number) => {
          this.position = value;
          this.updateHandlePosition();
        },
        positionGetter: () => this.position,
        sliderWidth: this.sliderWidth,
        speed: this.speed,
        selectDate: (type: string, detail: any) =>
          this.dateSelected.emit(detail),
        setPlayingState: (playing: boolean) => {
          this.isPlaying = playing;
        },
        animationFrameRef: this.animationFrameRef,
      });
    } else {
      cancelAnimationFrame(this.animationFrameRef.current);
    }
    if (this.timeline.nativeElement) {
      updatePlayPauseButton({
        timeline: this.timeline.nativeElement,
        isPlaying: this.isPlaying,
      });
    }
  }
}
