import { Component, AfterViewInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

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

  private svgElement!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private activeMetrics: Set<string> = new Set();
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

    this.svgElement = d3.select(element).append<SVGSVGElement>('svg')
      .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
      .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom);

    this.activeMetrics = new Set(this.config.metrics);
    this.drawChart();
  }

  private updateChart(): void {
    if (this.svgElement) {
      console.log('Updating chart');
      this.svgElement.selectAll('*').remove();
      this.drawChart();
    }
  }

  private drawChart(): void {
    if (!this.data.length || !this.config) {
      console.error('No data or config available to draw the chart');
      return;
    }

    console.log('Drawing chart with data:', this.data);
    console.log('Drawing chart with config:', this.config);

    const width = this.config.width - this.config.margin.left - this.config.margin.right;
    const height = this.config.height - this.config.margin.top - this.config.margin.bottom;

    const parseData = (data: DataPoint[], metrics: string[], accessor: string) => {
      const parseDate = d3.timeParse("%Y-%m-%d");
      return data.map((d) => ({
        date: parseDate(d.date) as Date,
        metrics: metrics.reduce((acc, metric) => {
          acc[metric] = (d[accessor as keyof DataPoint] as any)[metric];
          return acc;
        }, {} as { [key: string]: number }),
      }));
    };

    const parsedData = parseData(this.data, this.config.metrics, this.config.accessor);

    const createScales = (
      parsedData: any[],
      metrics: string[],
      width: number,
      height: number
    ) => {
      const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d3.max(metrics, metric => d.metrics[metric])) as number])
        .range([height, 0]);

      return { x, y };
    };

    const { x, y } = createScales(parsedData, this.config.metrics, width, height);

    const g = this.svgElement.append('g')
      .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);

    const drawAxes = (g: any, x: any, y: any, height: number) => {
      const tickFormat = (d: Date) => d3.timeFormat("%b %d")(d);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(tickFormat as any));

      g.append("g").call(d3.axisLeft(y));
    };

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const drawLines = (
      g: any,
      parsedData: any[],
      x: any,
      y: any,
      metrics: string[],
      activeMetrics: Set<string>
    ) => {
      const line = d3.line<any>()
        .x(d => x(d.date))
        .curve(d3.curveMonotoneX);

      metrics.forEach((metric, i) => {
        const metricLine = line.y(d => y(d.metrics[metric]));

        g.append("path")
          .datum(parsedData)
          .attr("fill", "none")
          .attr("stroke", color(metric))
          .attr("stroke-width", 1.5)
          .attr("d", metricLine)
          .attr("class", `line ${metric}`)
          .style("display", activeMetrics.has(metric) ? "block" : "none");
      });
    };

    const drawAverageLine = (
      g: any,
      parsedData: any[],
      x: any,
      y: any,
      activeMetrics: Set<string>
    ) => {
      const averagedData = parsedData.map(d => {
        const activeValues = Array.from(activeMetrics).map(metric => d.metrics[metric]);
        const average = activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length;
        return { date: d.date, average };
      });

      const avgLine = d3.line<{ date: Date; average: number }>()
        .x(d => x(d.date))
        .y(d => y(d.average))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(averagedData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", avgLine)
        .attr("class", "average-line");
    };

    const drawLegend = (
      svgElement: any,
      width: number,
      margin: any,
      metrics: string[],
      activeMetrics: Set<string>,
      toggleMetric: (metric: string) => void
    ) => {
      const legend = svgElement.append("g")
        .attr("transform", `translate(${width + margin.left + 20},${margin.top})`);

      metrics.forEach((metric, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0,${i * 20})`)
          .style("cursor", "pointer")
          .on("click", () => toggleMetric(metric));

        legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(metric))
          .attr("opacity", activeMetrics.has(metric) ? 1 : 0.3);

        legendRow.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("dy", "0.35em")
          .text(metric)
          .attr("fill", activeMetrics.has(metric) ? "black" : "grey");
      });
    };

    const toggleMetric = (
      metric: string,
      data: DataPoint[],
      config: Config,
      svgElement: any,
      activeMetrics: Set<string>
    ) => {
      if (activeMetrics.has(metric)) {
        activeMetrics.delete(metric);
      } else {
        activeMetrics.add(metric);
      }
      this.updateChart();
    };

    drawAxes(g, x, y, height);
    drawLines(g, parsedData, x, y, this.config.metrics, this.activeMetrics);
    drawAverageLine(g, parsedData, x, y, this.activeMetrics);
    drawLegend(
      this.svgElement,
      width,
      this.config.margin,
      this.config.metrics,
      this.activeMetrics,
      (metric) => toggleMetric(metric, this.data, this.config, this.svgElement, this.activeMetrics)
    );
  }
}
