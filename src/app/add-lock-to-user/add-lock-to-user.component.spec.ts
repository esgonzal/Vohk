import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLockToUserComponent } from './add-lock-to-user.component';

describe('AddLockToUserComponent', () => {
  let component: AddLockToUserComponent;
  let fixture: ComponentFixture<AddLockToUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLockToUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLockToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
