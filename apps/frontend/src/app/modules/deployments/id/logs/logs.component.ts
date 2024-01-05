import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';

import { DeploymentLogs } from '../../../../models/deployment.model';
import { DeploymentService } from '../../../../services/deployment.service';
import { $deployment } from '../../../../store/deployment.store';
import { LoaderComponent } from '../../../../components/loader/loader.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  public logs!: WritableSignal<DeploymentLogs>;

  constructor(private deploymentService: DeploymentService) {}

  ngOnInit(): void {
    this.logs = signal({} as DeploymentLogs);
    $deployment.subscribe((data) => {
      this.deploymentService.findLogsById(data.id).subscribe((data) => {
        this.logs.set(data);
      });
    });
  }
}
