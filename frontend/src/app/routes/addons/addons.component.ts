import { Component, Injector, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Addon } from '../../core/models/addon.model';
import { AddonService } from '../../shared/services/addon.service';

@Component({
  selector: 'app-addons',
  standalone: true,
  imports: [],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.scss',
})
export class AddonsComponent implements OnInit {
  public addons!: Signal<Addon[]>;

  constructor(private addonService: AddonService, private injector: Injector) {}

  ngOnInit(): void {
    this.addons = toSignal(this.addonService.findAll(), {
      initialValue: [],
      injector: this.injector,
    });
  }
}
