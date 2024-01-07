import { Component, Signal } from '@angular/core';

@Component({
  selector: 'app-addons',
  standalone: true,
  imports: [],
  templateUrl: './addons.component.html',
  styleUrl: './addons.component.css'
})
export class AddonsComponent {
  public addons!: Signal<Addon>;
}
