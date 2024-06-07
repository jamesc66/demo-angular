import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes';
import { TableComponent } from './components/table/table.component';
import { NavComponent } from './components/nav/nav.component';
import { ChartComponent } from './components/chart/chart.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [
    TableComponent, NavComponent, ChartComponent, FormComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
