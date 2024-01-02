import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() text = '';
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  @Input() size: 'sm' | 'lg' = 'sm';
  @Input() disabled = false;
  @Input() type = 'button';
}
