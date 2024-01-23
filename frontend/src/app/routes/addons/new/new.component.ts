import {
  Component,
  Injector,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Addon } from '../../../core/models/addon.model';
import { AddonService } from '../../../shared/services/addon.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss',
})
export class NewComponent implements OnInit {
  private name!: string;

  public addon: WritableSignal<Addon>;
  public selectedVersion: WritableSignal<string>;
  public form!: FormGroup;

  constructor(
    private addonService: AddonService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.addon = signal({} as Addon);
    this.selectedVersion = signal('latest');
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image: ['', [Validators.required]],
      port: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name') || '';

    this.addonService.findByName(this.name).subscribe((data) => {
      this.addon.set(data);

      this.form.setValue({
        name: data.name,
        description: data.description,
        image: data.image,
        port: data.port,
      });

      data.envs.forEach((env) => {
        this.form.addControl(
          env.key,
          new FormControl(env.value, env.optional ? [] : [Validators.required])
        );
      });

      data.volumes.forEach((volume) => {
        this.form.addControl(
          volume.path,
          new FormControl(volume.path, [Validators.required])
        );
      });
    });
  }

  public deployAddon(): void {
    console.log('controls', {
      ...this.form.value,
      version: this.selectedVersion(),
    });
  }

  get f() {
    return this.form.controls;
  }
}
