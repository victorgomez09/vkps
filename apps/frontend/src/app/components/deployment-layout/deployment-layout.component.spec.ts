import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentLayoutComponent } from './deployment-layout.component';

describe('DeploymentLayoutComponent', () => {
  let component: DeploymentLayoutComponent;
  let fixture: ComponentFixture<DeploymentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeploymentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
