import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiLabelModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiCardModule } from '@taiga-ui/experimental';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextareaModule,
  tuiInputNumberOptionsProvider
} from '@taiga-ui/kit';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    TuiCardModule,
    TuiLabelModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiSvgModule,
    ReactiveFormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: '',
      image: ['', [Validators.required]],
      version: ['', [Validators.required]],
      replicas: [1, [Validators.required, Validators.min(1)]],
      memory: [256, [Validators.required, Validators.min(256)]],
      cpu: [150, [Validators.required, Validators.min(150)]]
    });
  }

  ngOnInit(): void {
    console.log('init');
  }
}
