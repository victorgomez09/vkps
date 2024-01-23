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

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss',
})
export class NewComponent implements OnInit {
  private name!: string;

  public addon: WritableSignal<Addon>;
  public selectedVersion: WritableSignal<string>;

  constructor(
    private addonService: AddonService,
    private route: ActivatedRoute
  ) {
    this.addon = signal({} as Addon);
    this.selectedVersion = signal('latest');
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name') || '';

    this.addonService.findByName(this.name).subscribe((data) => {
      this.addon.set(data);
    });
  }
}
