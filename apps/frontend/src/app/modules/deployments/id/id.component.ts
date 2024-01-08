import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoaderComponent } from '../../../components/loader/loader.component';
import { DeploymentVolume } from '../../../models/deployment-volume.model';
import { Deployment } from '../../../models/deployment.model';
import { DeploymentEnv } from '../../../models/deploymentenv.model';
import { DeploymentService } from '../../../services/deployment.service';
import { $deployment } from '../../../store/deployment.store';

@Component({
  selector: 'app-id',
  standalone: true,
  imports: [LoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './id.component.html',
  styleUrl: './id.component.css'
})
export class IdComponent implements OnInit {
  public deployment!: WritableSignal<Deployment>;
  public form!: FormGroup;

  constructor(private deploymentService: DeploymentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.deployment = signal({} as Deployment);
    $deployment.subscribe((data) => {
      this.deployment.set(data);

      this.form = this.fb.group({
        name: [this.deployment().name, [Validators.required]],
        repositoryUrl: [this.deployment().repositoryUrl],
        image: [this.deployment().image],
        replicas: [this.deployment().replicas, [Validators.required, Validators.min(1)]],
        memory: [this.deployment().memory, [Validators.required, Validators.min(256)]],
        cpu: [this.deployment().cpu, [Validators.required, Validators.min(500)]],
        exposedNetwork: [this.deployment().exposedNetwork, [Validators.required]],
        port: [this.deployment().port, [Validators.required]],
        env: this.fb.array([]),
        volumes: this.fb.array([])
      });
    });
  }

  addEnvField(): void {
    this.env.push(this.createEnvField());
  }

  removeEnvField(index: number): void {
    this.env.removeAt(index);
  }

  addVolumeField(): void {
    this.volumes.push(this.createVolumeField());
  }

  removeVolumeField(index: number): void {
    this.volumes.removeAt(index);
  }

  handleSubmit() {
    const envValues: DeploymentEnv[] = [];
    Object.values(this.env.value).forEach((value: unknown) => {
      envValues.push({
        key: (value as { key: string; value: string }).key,
        value: (value as { key: string; value: string }).value
      });
    });

    const volumeValues: DeploymentVolume[] = [];
    Object.values(this.volumes.value).forEach((value: unknown) => {
      volumeValues.push({
        path: (value as { path: string; size: string }).path,
        size: (value as { path: string; size: string }).size,
        accessMode: 'ReadWriteOnce'
      });
    });

    this.deploymentService
      .create({
        name: this.f['name'].value,
        description: '',
        image: this.f['image'].value,
        replicas: this.f['replicas'].value,
        memory: String(this.f['memory'].value),
        cpu: this.f['cpu'].value,
        exposedNetwork: this.f['exposedNetwork'].value,
        port: this.f['port'].value,
        envs: envValues,
        volumes: volumeValues
      })
      .subscribe((data) => {
        console.log('data', data);
      });
  }

  get env(): FormArray {
    return <FormArray>this.form.get('env');
  }

  get volumes(): FormArray {
    return <FormArray>this.form.get('volumes');
  }

  get f() {
    return this.form.controls;
  }

  /* private methods */
  private createEnvField(): FormGroup {
    return this.fb.group({
      key: [null, Validators.required],
      value: [null, Validators.required]
    });
  }

  private createVolumeField(): FormGroup {
    return this.fb.group({
      path: [null, Validators.required],
      size: [null, Validators.required]
    });
  }
}
