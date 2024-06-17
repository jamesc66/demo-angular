import { Component } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css'],
  standalone: true,
  imports: [ChartComponent]
})
export class ChartPageComponent {
  chartData = [
    { date: new Date('2010-01-01'), value: 30 },
    { date: new Date('2010-02-01'), value: 50 },
    { date: new Date('2010-03-01'), value: 80 },
    { date: new Date('2010-04-01'), value: 65 },
    { date: new Date('2010-05-01'), value: 95 },
    { date: new Date('2010-06-01'), value: 55 }
  ];

  chartConfig: any = {
    width: 800,
    height: 400,
    margin: { top: 20, right: 20, bottom: 30, left: 50 },
    color: 'red'
  };
}
