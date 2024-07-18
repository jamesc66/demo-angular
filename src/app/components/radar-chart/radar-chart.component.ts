import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css'],
  standalone: true,
})
export class RadarChartComponent implements OnChanges {
  @Input() data: any;
  @Input() config: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('data:', this['data']);
    }
    if (changes['config']) {
      console.log('config:', this['config']);
    }
  }
}
