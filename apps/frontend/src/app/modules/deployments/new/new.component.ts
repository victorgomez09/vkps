import { Component } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {}
