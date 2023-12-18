import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  public items!: MenuItem[];
  public activeItem!: MenuItem;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.items = [
      {
        // label: 'VKPS',
        items: [
          {
            label: 'Applications',
            icon: 'pi pi-th-large',
            routerLink: ['/applications'],
            routerLinkActiveOptions: { expanded: true }
          },
          {
            label: 'Databases',
            icon: 'pi pi-database',
            routerLink: ['/databases']
          }
        ]
      }
    ];
  }
}
