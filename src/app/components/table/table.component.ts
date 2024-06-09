import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { TabulatorFull as TabulatorTable } from 'tabulator-tables';
import type { Tabulator } from 'tabulator-tables';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '311px';
  @Input() id: string = 'table';

  private tab: Tabulator | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.drawTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tab) {
      this.tab.setData(this.tableData);
      this.tab.setColumns(this.columnNames);
    } else {
      this.drawTable();
    }
  }

  private drawTable(): void {
    if (!Array.isArray(this.columnNames)) {
      console.error('Columns is not an array:', this.columnNames);
      return;
    }
    this.tab = new TabulatorTable(`#${this.id}`, {
      data: this.tableData,
      reactiveData: true,
      columns: this.columnNames,
      layout: 'fitData',
      height: this.height
    });
  }
}
