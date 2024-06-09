import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-table-page',
  standalone: true,
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css'],
  imports: [CommonModule, TableComponent]
})
export class TablePageComponent implements OnInit {
  data$!: Observable<any>;
  columns$!: Observable<any>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData();
    this.data$ = this.dataService.getData();
    this.columns$ = this.dataService.getColumns();
  }
}
