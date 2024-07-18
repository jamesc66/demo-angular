import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css'],
  standalone: true,
  imports: [ChartComponent]
})
export class ChartPageComponent implements OnInit {
  data: any[] = [];
  config: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData();

    this.dataService.getCharts().subscribe(charts => {
      if (charts) {
        this.config = charts; // Assign the specific chart config
        this.dataService.getData().subscribe((data: any) => {
        console.log('Charts:', data.humidity);
        this.data = data.reviews; // Replace 'reviews' with the actual data key if different
        });
      }
    });
  }
}
