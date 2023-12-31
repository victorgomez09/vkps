import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() text = '';
  @Input() color = 'blue';
  @Input() size = 'sm';
  @Input() disabled = false;
  @Input() type = 'button';
}
