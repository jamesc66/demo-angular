import { Component } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';

@Component({
  selector: 'app-chart-page',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './chart-page.component.html',
  styleUrl: './chart-page.component.css'
})
export class ChartPageComponent {

}
