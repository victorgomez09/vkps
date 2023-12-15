import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';

import { ThemeService } from '../../../core/services/theme.service';

interface Theme {
  name: string;
  code: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, DropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public themes!: Theme[];

  constructor(private service: ThemeService) {}

  ngOnInit() {
    this.themes = [
      {
        name: 'Saga blue',
        code: 'saga-blue'
      },
      {
        name: 'Bootstrap purple',
        code: 'bootstrap4-light-purple'
      }
    ];
    // 'vela-blue',
    //   'arya-blue',
    //   'md-light-indigo',
    //   'md-dark-indigo',
    //   'bootstrap4-light-purple',
    //   'bootstrap4-dark-purple'
  }

  changeTheme(theme: Theme): void {
    console.log('theme', theme);
    this.service.switchTheme(theme.code);
  }
}
