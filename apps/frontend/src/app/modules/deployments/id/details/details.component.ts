import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { $deployment } from '../../../../store/deployment.store';
import { Deployment } from '../../../../models/deployment.model';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { DeploymentService } from '../../../../services/deployment.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  public deployment!: WritableSignal<Deployment>;

  constructor(private deploymentService: DeploymentService) {}

  ngOnInit(): void {
    this.deployment = signal({} as Deployment);

    $deployment.subscribe((data) => {
      this.deployment.set(data);
      console.log('data', data);
    });
  }

  public deploy() {
    this.deploymentService.deploy(this.deployment().id).subscribe((data) => {
      console.log(data);
    });
  }
}
