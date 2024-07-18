import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XYConfig } from '../../xy';
import { XyComponent } from '../../components/xy/xy.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-xy-page',
  standalone: true,
  imports: [XyComponent, CommonModule],
  templateUrl: './xy-page.component.html',
  styleUrls: ['./xy-page.component.css']
})
export class XyPageComponent {
  data = [];

  xyConfig: XYConfig = {
    variant: "xy",
    nKey: "location",
    xKey: "date",
    yKey: "value",
    dKey: "values",
    ticks: 5,
    show: ["grid", "axis", "areas", "points", "lines", "enableZoom"],
    defaultFeatures: ["axis", "lines", "enableZoom"],
    margin: { top: 20, right: 40, bottom: 40, left: 40 },
    lineWidth: 1,
    pointWidth: 2,
    width: 500,
    height: 400,
    enableZoom: true,
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
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData();
        this.dataService.getData().subscribe((data: any) => {
        console.log('Charts:', data.humidity);
        this.data = data.humidity; // Replace 'reviews' with the actual data key if different
        });
      }
}
