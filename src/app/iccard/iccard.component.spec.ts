import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICCardComponent } from './iccard.component';

describe('ICCardComponent', () => {
  let component: ICCardComponent;
  let fixture: ComponentFixture<ICCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ICCardComponent]
    });
    fixture = TestBed.createComponent(ICCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
