import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [RadarChartComponent],
  templateUrl: './radar-page.component.html',
  styleUrl: './radar-page.component.css'
})
export class RadarPageComponent implements OnInit {
  data: any = [];
  config: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get('assets/data/columns.json').subscribe((data: any) => {
      this.data = data;
      this.config = {
        variant: "radar",
        nKey: "room",
        xKey: "insight",
        yKey: "value",
        dataKey: "insight",
        timeKey: "date",
        seriesKey: "room",
        show: [
          "grid",
          "axis",
          "areas",
          "points",
          "lines",
          "heat",
          "annotations",
          "shadedSegments",
        ],
        togle: true,
        defaultFeatures: [
          "axis",
          "lines",
          "areas",
          "grid",
          "points",
          "annotations",
          "shadedSegments",
        ],
        margin: { top: 40, right: 100, bottom: 0, left: 100 },
        width: 500,
        height: 400,
        colors: [
          "#4383DD", // Blue
          "#F47ED4", // Pink
          "#57CAAB", // Teal
          "#DDC543", // Yellow (Triadic to Blue)
          "#DD4343", // Red (Triadic to Teal)
          "#DD8743", // Orange (Triadic to Pink)
          "#3560A8", // Darker Blue Shade
          "#DF6BBD", // Darker Pink Shade
          "#4AA68F", // Darker Teal Shade
        ],
        shadedSegments: [
          { startAxis: 2.5, endAxis: 3.5, color: "white", opacity: 1 },
          { startAxis: 5.5, endAxis: 6.5, color: "white", opacity: 1 },
        ],
      }
    });
  }
}
