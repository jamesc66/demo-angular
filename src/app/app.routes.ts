import { Routes } from '@angular/router';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ChartPageComponent } from './pages/chart-page/chart-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'table', component: TablePageComponent },
    { path: 'form', component: FormPageComponent },
    { path: 'chart', component: ChartPageComponent },
    { path: '', component: LandingPageComponent },
  ];
