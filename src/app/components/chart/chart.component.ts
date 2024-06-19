import { Component, AfterViewInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { initializeChart } from './chart';


interface Config {
  margin: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  metrics: string[];
  accessor: string;
}

interface DataPoint {
  date: string;
  rating_metrics: { [key: string]: number };
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  standalone: true
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chart') private chartContainer!: ElementRef;
  @Input() data: DataPoint[] = [];
  @Input() config: Config = {
    margin: { top: 20, right: 20, bottom: 30, left: 50 },
    width: 800,
    height: 400,
    metrics: [],
    accessor: 'rating_metrics'
  };

  private isConfigReady: boolean = false;
  private isDataReady: boolean = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.isConfigReady = !!this.config && !!this.config.margin;
    if (this.isConfigReady && this.isDataReady) {
      console.log('ngAfterViewInit - Initializing chart');
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      console.log('ngOnChanges - data:', changes['data'].currentValue);
      this.isDataReady = changes['data'].currentValue.length > 0;
    }
    if (changes['config'] && changes['config'].currentValue) {
      console.log('ngOnChanges - config:', changes['config'].currentValue);
      this.isConfigReady = !!changes['config'].currentValue && !!changes['config'].currentValue.margin;
    }
    if (this.isConfigReady && this.isDataReady) {
      console.log('ngOnChanges - Updating chart');
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    console.log('Initializing chart');
    const element = this.chartContainer.nativeElement;
    initializeChart(element, this.data, this.config);
  }
}
