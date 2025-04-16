import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLayoutPage } from './dashboard-layout.page';

describe('DashboardLayoutPage', () => {
  let component: DashboardLayoutPage;
  let fixture: ComponentFixture<DashboardLayoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
