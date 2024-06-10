import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-page',
  standalone: true,
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.css'],
  imports: [CommonModule, FormComponent]
})
export class FormPageComponent implements OnInit {
  loading$!: Observable<boolean>;
  data$!: Observable<any>;
  forms$!: Observable<any>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData();
    this.loading$ = this.dataService.loading$;
    this.data$ = this.dataService.data$;
    this.forms$ = this.dataService.forms$;
  }

  handleSubmit(event: any) {
    console.log('Submitted data:', event);
  }
}
