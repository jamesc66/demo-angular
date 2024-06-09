import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { NavComponent } from './components/nav/nav.component';
import { ChartComponent } from './components/chart/chart.component';
import { FormComponent } from './components/form/form.component';
import { DataService } from './services/data.service';
import { appConfig } from './app.config';

// Define your routes here
const routes: Routes = [
  { path: 'table', component: TableComponent },
  { path: 'nav', component: NavComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'form', component: FormComponent },
  { path: '', redirectTo: '/table', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), // Only modules go here
    TableComponent, // Import standalone components here
    NavComponent,
    ChartComponent,
    FormComponent
  ],
  providers: [
    DataService,
    ...appConfig.providers // Spread the providers from the configuration
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
