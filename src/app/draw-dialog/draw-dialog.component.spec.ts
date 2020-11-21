import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawDialogComponent } from './draw-dialog.component';

describe('DrawDialogComponent', () => {
  let component: DrawDialogComponent;
  let fixture: ComponentFixture<DrawDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
