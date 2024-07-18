import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XyPageComponent } from './xy-page.component';

describe('XyPageComponent', () => {
  let component: XyPageComponent;
  let fixture: ComponentFixture<XyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
