import { Component, Injector, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Deployment } from '../../models/deployment.model';
import { DeploymentService } from '../../services/deployment.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ButtonComponent } from '../../components/button/button.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deployments',
  standalone: true,
  imports: [LoaderComponent, ButtonComponent, CardComponent, RouterModule, CommonModule],
  templateUrl: './deployments.component.html',
  styleUrl: './deployments.component.css'
})
export class DeploymentsComponent implements OnInit {
  public deployments!: Signal<Deployment[]>;

  constructor(private deploymentService: DeploymentService, private injector: Injector) {}

  ngOnInit(): void {
    this.deployments = toSignal(this.deploymentService.findAll(), {
      initialValue: [],
      injector: this.injector
    });

    console.log(this.deployments());
  }
}
