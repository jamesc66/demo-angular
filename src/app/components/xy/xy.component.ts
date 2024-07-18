import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { XYConfig, createSvg, useScales, useColors, useZoom, initializeXYElements, initializeShow, addLegend, addToggles } from '../../xy';
import * as d3 from 'd3';

@Component({
  selector: 'app-xy',
  templateUrl: './xy.component.html',
  styleUrls: ['./xy.component.css'],
  standalone: true,
})
export class XyComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() config!: XYConfig; // Add the definite assignment assertion

  private svgElement!: SVGSVGElement; // Add the definite assignment assertion
  private controlsElement!: HTMLDivElement;
  private selectedSeries: Set<string> = new Set();
  private color!: d3.ScaleOrdinal<string, unknown>; // Add the definite assignment assertion
  private show!: { [key: string]: boolean };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.svgElement = this.el.nativeElement.querySelector('svg');
    this.controlsElement = this.el.nativeElement.querySelector('.controls');
    this.initializeSelectedSeries();
    this.initializeColorScale();
    this.initializeShow();
    this.startGraph();
  }

  private initializeSelectedSeries(): void {
    this.selectedSeries = new Set(this.data.map(d => d[this.config.nKey]));
  }

  private initializeColorScale(): void {
    const series = Array.from(new Set(this.data.map(d => d[this.config.nKey])));
    this.color = d3.scaleOrdinal(this.config.colors).domain(series);
  }

  private initializeShow(): void {
    this.show = initializeShow({ defaultFeatures: this.config.defaultFeatures });
  }

  private startGraph(): void {
    const margin = this.config.margin;
    const width = this.config.width - margin.left - margin.right;
    const height = this.config.height - margin.top - margin.bottom;

    d3.select(this.svgElement).selectAll('*').remove();
    d3.select(this.controlsElement).selectAll('*').remove();

    const svg = createSvg(this.svgElement, width, height, margin);
    const { x, y } = useScales({
      data: this.data,
      width,
      height,
      xKey: this.config.xKey,
      yKey: this.config.yKey,
      dKey: this.config.dKey,
    });
    const graphGroup = svg.append('g').attr('clip-path', 'url(#clip)');

    useZoom({
      svgElement: this.svgElement,
      x,
      y,
      width,
      height,
      show: this.show,
      data: this.data,
      color: this.color,
      selectedSeries: this.selectedSeries,
      ticks: this.config.ticks,
      lineWidth: this.config.lineWidth,
      pointWidth: this.config.pointWidth,
      nKey: this.config.nKey,
      xKey: this.config.xKey,
      yKey: this.config.yKey,
      dKey: this.config.dKey,
    });

    initializeXYElements({
      svg,
      graphGroup,
      data: this.data,
      x,
      y,
      color: this.color,
      selectedSeries: this.selectedSeries,
      show: this.show,
      width,
      height,
      ticks: this.config.ticks,
      lineWidth: this.config.lineWidth,
      pointWidth: this.config.pointWidth,
      nKey: this.config.nKey,
      xKey: this.config.xKey,
      yKey: this.config.yKey,
      dKey: this.config.dKey,
    });

    const controlSvg = d3
      .select(this.controlsElement)
      .append('svg')
      .attr('width', 200)
      .attr('height', this.data.length * 25 + Object.keys(this.show).length * 25);

    addLegend({
      svg: controlSvg.append('g').attr('class', 'legend'),
      data: this.data,
      width: 180,
      color: this.color,
      selectedSeries: this.selectedSeries,
      toggleSeries: (nKey) => this.toggleSeries(nKey),
      nKey: this.config.nKey,
    });

    addToggles(
      controlSvg
        .append('g')
        .attr('class', 'toggles')
        .attr('transform', `translate(0, ${this.data.length * 25})`),
      this.show,
      (option) => this.toggleShow(option)
    );
  }

  private toggleSeries(nKey: string): void {
    if (this.selectedSeries.has(nKey)) {
      this.selectedSeries.delete(nKey);
    } else {
      this.selectedSeries.add(nKey);
    }
    this.startGraph();
  }

  private toggleShow(option: string): void {
    this.show[option] = !this.show[option];
    this.startGraph();
  }
}
