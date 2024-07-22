import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import {
  initializeSeriesColors,
  initializeSVG,
  calculateAngleSlice,
  initializeScale,
  initializeShow,
  initializeRadarElements,
  addLegend,
  addToggles,
  RadarConfig,
  initializeControls,
} from './radar';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css'],
  standalone: true,
})
export class RadarChartComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] = [{ room: '', insight: '', value: 0 }];
  @Input() config!: RadarConfig;
  @Input() allData: any[] = [];

  @ViewChild('radarChart', { static: true }) radarChart!: ElementRef;
  @ViewChild('legend', { static: true }) legend!: ElementRef;

  show: any = {};
  nestedData!: Map<any, Record<string, any>[]>;
  nestedAllData!: Map<any, Record<string, any>[]>;
  selectedSeries: Set<string> = new Set();
  seriesColorMap: Map<string, string> = new Map<string, string>();
  series: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['config'] || changes['allData']) {
      this.updateData();
    }
  }

  ngAfterViewInit() {
    this.initializeChart();
    this.updateData();
  }

  initializeChart() {
    this.show = initializeShow({ config: this.config });
    this.nestedData = d3.group(this.data, (d) => d[this.config.nKey]);
    this.nestedAllData = d3.group(this.allData, (d) => d[this.config.nKey]);
    initializeSeriesColors({
      data: this.data,
      seriesKey: this.config.seriesKey,
      seriesColorMap: this.seriesColorMap,
      customColorScale: this.config.colors,
    });

    this.series = Array.from(new Set(this.data.map((d) => d[this.config.seriesKey])));
    this.selectedSeries = new Set(this.series);
    this.drawChart(true);
  }

  updateData() {
    this.nestedData = d3.group(this.data, (d) => d[this.config.nKey]);
    this.nestedAllData = d3.group(this.allData, (d) => d[this.config.nKey]);
    this.series = Array.from(new Set(this.data.map((d) => d[this.config.seriesKey])));
    this.selectedSeries = new Set(this.series); // Ensure all series are selected on update
    this.drawChart(false);
  }

  drawChart(initialLoad: boolean) {
    const margin = this.config.margin;
    const width = this.config.width - margin.left - margin.right;
    const height = this.config.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = initializeSVG({
      margin,
      width,
      height,
      element: this.radarChart.nativeElement,
    }) as unknown as d3.Selection<SVGGElement, unknown, null, undefined>;
    const angleSlice = calculateAngleSlice({ data: this.nestedData });
    const rScale = initializeScale({ radius });

    const filteredData = new Map(
      Array.from(this.nestedData.entries()).filter(([key]) =>
        this.selectedSeries.has(key)
      )
    );

    initializeRadarElements({
      svg,
      filteredData,
      rScale,
      angleSlice,
      initialLoad,
      seriesColorMap: this.seriesColorMap,
      config: this.config,
      show: this.show,
      allData: this.nestedAllData,
      radius,
      shadedSegments: this.config.shadedSegments,
    });

    const legendContainer = d3.select(this.legend.nativeElement);
    legendContainer.selectAll('*').remove();

    const { legend, toggles } = initializeControls({
      legendContainer,
      series: this.series.map((s) => ({ [this.config.nKey]: s })),
      show: this.show,
    });

    addLegend({
      svg: legend,
      data: this.series.map((key) => ({
        [this.config.nKey]: key,
      })),
      width: 180,
      color: (key: string) => this.seriesColorMap.get(key) || 'black',
      selectedSeries: this.selectedSeries,
      toggleSeries: this.toggleSeries.bind(this),
      nKey: this.config.nKey,
    });

    addToggles({
      svg: toggles,
      show: this.show,
      toggleShow: this.toggleShow.bind(this),
    });
  }

  toggleSeries(d: any) {
    if (this.selectedSeries.has(d)) {
      this.selectedSeries.delete(d);
    } else {
      this.selectedSeries.add(d);
    }
    this.drawChart(false);
  }

  toggleShow(option: string) {
    this.show[option] = !this.show[option];
    this.drawChart(false);
  }
}
