import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildpackComponent } from './buildpack.component';

describe('BuildpackComponent', () => {
  let component: BuildpackComponent;
  let fixture: ComponentFixture<BuildpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildpackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
