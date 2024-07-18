import { Component } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [RadarChartComponent],
  templateUrl: './radar-page.component.html',
  styleUrl: './radar-page.component.css'
})
export class RadarPageComponent {

}
