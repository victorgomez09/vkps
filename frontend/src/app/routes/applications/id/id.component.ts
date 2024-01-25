import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../shared/services/application.service';
import { Application } from '../../../core/models/application.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './id.component.html',
  styleUrl: './id.component.scss',
})
export class IdComponent implements OnInit {
  private id!: string;

  public application!: WritableSignal<Application>;

  constructor(
    private activateRoute: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];

    this.applicationService.findOne(this.id).subscribe((application) => {
      this.application = signal(application);
    });
  }
}
