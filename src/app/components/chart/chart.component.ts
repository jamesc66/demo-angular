import { Component, AfterViewInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  standalone: true
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chart') private chartContainer!: ElementRef;
  @Input() data: Array<{ date: Date, value: number }> = [];
  @Input() config: any = {};

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width!: number;
  private height!: number;

  constructor() { }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.updateChart();
    }
  }

  private setDimensions(): void {
    this.margin = this.config.margin || this.margin;
    this.width = (this.config.width || this.chartContainer.nativeElement.offsetWidth) - this.margin.left - this.margin.right;
    this.height = (this.config.height || this.chartContainer.nativeElement.offsetHeight) - this.margin.top - this.margin.bottom;
  }

  private createChart(): void {
    this.setDimensions();
    const element = this.chartContainer.nativeElement;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const x = d3.scaleTime().range([0, this.width]);
    const y = d3.scaleLinear().range([this.height, 0]);

    const line = d3.line<{ date: Date, value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value));

    x.domain(d3.extent(this.data, d => d.date) as [Date, Date]);
    y.domain([0, d3.max(this.data, d => d.value) as number]);

    svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', this.config.color || 'steelblue')
      .style('stroke-width', '2px');
  }

  private updateChart(): void {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();
    this.createChart();
  }
}
