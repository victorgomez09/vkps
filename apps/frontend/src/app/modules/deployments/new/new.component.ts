import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { CardComponent } from '../../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { DeploymentService } from '../../../services/deployment.service';
import { DeploymentVolume } from '../../../models/deployment-volume.model';
import { DeploymentEnv } from '../../../models/deploymentenv.model';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CardComponent, ButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit {
  public form!: FormGroup;
  public selectedSource!: 'docker' | 'git';
  public signalSelected!: WritableSignal<'docker' | 'git'>;

  constructor(private deploymentService: DeploymentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.selectedSource = 'docker';
    this.signalSelected = signal('docker');

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      repositoryUrl: [''],
      image: [''],
      replicas: [1, [Validators.required, Validators.min(1)]],
      memory: ['256', [Validators.required, Validators.min(256)]],
      cpu: ['500', [Validators.required, Validators.min(500)]],
      exposedNetwork: [false, [Validators.required]],
      port: [80, [Validators.required]],
      env: this.fb.array([]),
      volumes: this.fb.array([])
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
        repositoryUrl: this.f['repositoryUrl'].value,
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
