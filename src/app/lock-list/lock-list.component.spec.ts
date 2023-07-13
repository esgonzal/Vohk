import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockListComponent } from './lock-list.component';

describe('LockListComponent', () => {
  let component: LockListComponent;
  let fixture: ComponentFixture<LockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
