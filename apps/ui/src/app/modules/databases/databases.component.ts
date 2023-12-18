import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';

import { DatabaseService } from '../../core/services/database.service';
import { Database } from '../../shared/types/database.type';

@Component({
  selector: 'app-databases',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, ChipModule, CardModule],
  templateUrl: './databases.component.html',
  styleUrl: './databases.component.css'
})
export class DatabasesComponent implements OnInit {
  public databases!: Signal<Database[]>;
  public loading!: WritableSignal<boolean>;

  constructor(
    private service: DatabaseService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.loading = signal(true);
    this.databases = toSignal(this.service.findAll(), {
      initialValue: [],
      injector: this.injector
    });

    this.loading.update(() => false);
  }
}
