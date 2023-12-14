import { Component, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiCardModule, TuiIconModule, TuiTitleModule } from '@taiga-ui/experimental';
import { TuiInputModule, TuiInputNumberModule, TuiTextareaModule } from '@taiga-ui/kit';

import { ApplicationService } from '../../../core/services/application.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    TuiCardModule,
    TuiLabelModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiButtonModule,
    TuiTitleModule,
    TuiIconModule,

    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  public form!: FormGroup;

  constructor(private service: ApplicationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: '',
      image: ['', [Validators.required]],
      version: ['', [Validators.required]],
      replicas: [1, [Validators.required, Validators.min(1)]],
      memory: [256, [Validators.required, Validators.min(256)]],
      cpu: [150, [Validators.required, Validators.min(150)]],
      env: this.fb.array([]),
      volumes: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  addEnvField(): void {
    this.env.push(this.createEnvField());
  }

  removeEnvField(index: number): void {
    (<FormArray>this.form.get('env')).removeAt(index);
  }

  handleSubmit() {
    const envValues: { [key: string]: string } = {};
    Object.values(this.env.value).forEach((e: any) => {
      envValues[e.key] = e.value;
    });
    console.log('values', envValues);
    // TODO: volumes

    this.service.create(this.form.value);
  }

  get env(): FormArray {
    return <FormArray>this.form.get('env');
  }

  /* private methods */
  private createEnvField(): FormGroup {
    return this.fb.group({
      key: [null, Validators.required],
      value: [null, Validators.required]
    });
  }
}
