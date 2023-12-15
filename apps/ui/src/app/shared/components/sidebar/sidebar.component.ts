import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  public items!: MenuItem[];

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'VKPS',
        items: [
          {
            label: 'Applications',
            icon: 'pi pi-th-large',
            routerLink: '/applications'
          },
          {
            label: 'Databases',
            icon: 'pi pi-database',
            routerLink: '/addons'
          }
        ]
      }
    ];
  }
}
