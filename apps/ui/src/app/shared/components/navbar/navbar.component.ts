import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, InputSwitchModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public isDark!: boolean;

  constructor(private service: ThemeService) {}

  ngOnInit() {
    this.isDark = localStorage.getItem('theme') === 'light' ? false : true || false;
    this.service.loadTheme();
  }

  changeTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.service.switchTheme(this.isDark);
  }
}
