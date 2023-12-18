import { Component, Injector, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { ApplicationService } from '../../core/services/application.service';
import { Application } from '../../shared/types/application.type';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [DataViewModule, ButtonModule, CardModule, RouterModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  public applications!: Signal<Application[]>;

  constructor(
    private service: ApplicationService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.applications = toSignal(this.service.findAll(), {
      initialValue: [],
      injector: this.injector
    });
  }
}
