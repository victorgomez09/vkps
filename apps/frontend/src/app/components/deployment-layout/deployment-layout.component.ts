import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeploymentService } from '../../services/deployment.service';
import { $deployment } from '../../store/deployment.store';
import { Deployment } from '../../models/deployment.model';

@Component({
  selector: 'app-deployment-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deployment-layout.component.html',
  styleUrl: './deployment-layout.component.css'
})
export class DeploymentLayoutComponent implements OnInit {
  public id!: string;
  public selectedTab!: string;
  public deployment!: Signal<Deployment>;

  constructor(
    private deploymentService: DeploymentService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.selectedTab = this.router.url.split('/')[3];

    this.router.events.subscribe(() => {
      this.selectedTab = this.router.url.split('/')[3];
    });

    this.deploymentService.findById(this.id).subscribe((data) => {
      console.log('data from template', data);
      $deployment.next(data);
      this.deployment = signal(data);
    });
  }
}
