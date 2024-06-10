import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Field {
  title: string;
  field: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  validation?: string;
  min?: number;
  max?: number;
  options?: string[];
}

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FormComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() data: { [key: string]: any } = {};
  @Output() submit = new EventEmitter<any>();

  tempValues: { [key: string]: any } = {};

  ngOnInit() {
    this.fields.forEach(field => {
      this.tempValues[field.field] = this.getNestedValue(this.data, field.field) || '';
    });
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const dataObj: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      this.setNestedValue(dataObj, key, value);
    });
    this.submit.emit(dataObj);
  }
}
