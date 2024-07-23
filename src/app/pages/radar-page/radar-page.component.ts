import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RadarChartComponent,
    TimelineComponent,
  ],
  templateUrl: './radar-page.component.html',
  styleUrls: ['./radar-page.component.css'],
})
export class RadarPageComponent implements OnInit {
  data: any = [];
  config: any = {};
  allData: any = [];
  selectedDate: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get('assets/data/room-insights.json').subscribe((data: any) => {
      this.allData = data;
      if (data.length > 0) {
        this.selectedDate = data[0].date; // Initialize with the first date
        this.updateSelectedData();
      } else {
        console.warn('No data available in room-insights.json');
      }
      this.config = {
        variant: 'radar',
        nKey: 'room',
        xKey: 'insight',
        yKey: 'value',
        dataKey: 'insight',
        timeKey: 'date',
        seriesKey: 'room',
        show: [
          'grid',
          'axis',
          'areas',
          'points',
          'lines',
          'annotations',
          'shadedSegments',
        ],
        toggle: true,
        defaultFeatures: [
          'axis',
          'lines',
          'areas',
          'grid',
          'points',
          'annotations',
          'shadedSegments',
        ],
        margin: { top: 40, right: 100, bottom: 0, left: 100 },
        width: 500,
        height: 400,
        colors: [
          '#4383DD', // Blue
          '#F47ED4', // Pink
          '#57CAAB', // Teal
          '#DDC543', // Yellow (Triadic to Blue)
          '#DD4343', // Red (Triadic to Teal)
          '#DD8743', // Orange (Triadic to Pink)
          '#3560A8', // Darker Blue Shade
          '#DF6BBD', // Darker Pink Shade
          '#4AA68F', // Darker Teal Shade
        ],
        shadedSegments: [
          { startAxis: 2.5, endAxis: 3.5, color: 'white', opacity: 1 },
          { startAxis: 5.5, endAxis: 6.5, color: 'white', opacity: 1 },
        ],
      };
    });
  }

  handleDateSelected(event: any) {
    this.selectedDate = event;
    this.updateSelectedData();
  }

  updateSelectedData() {
    const selectedData = this.allData.find(
      (d: any) => d.date === this.selectedDate
    );
    if (selectedData) {
      this.data = selectedData.insight;
      this.cdr.detectChanges(); // Manually trigger change detection
    } else {
    }
  }
}
