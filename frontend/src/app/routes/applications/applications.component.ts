import { Component, Injector, OnInit, Signal } from '@angular/core';
import { Application } from '../../core/models/application.model';
import { ApplicationService } from '../../shared/services/application.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent implements OnInit {
  public applications!: Signal<Application[]>;

  constructor(
    private applicationService: ApplicationService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.applications = toSignal(this.applicationService.findAll(), {
      initialValue: [],
      injector: this.injector,
    });
  }
}
