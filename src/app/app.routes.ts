import { Routes } from '@angular/router';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ChartPageComponent } from './pages/chart-page/chart-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { XyPageComponent } from './pages/xy-page/xy-page.component';
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';
import { RadarPageComponent } from './pages/radar-page/radar-page.component';

export const routes: Routes = [
    { path: 'table', component: TablePageComponent },
    { path: 'form', component: FormPageComponent },
    { path: 'chart', component: ChartPageComponent },
    { path: 'xy', component: XyPageComponent },
    { path: 'radar', component: RadarPageComponent },
    { path: '', component: LandingPageComponent },
  ];
