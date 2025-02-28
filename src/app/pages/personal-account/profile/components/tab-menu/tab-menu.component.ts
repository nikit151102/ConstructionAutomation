import { Component, OnInit } from '@angular/core';
import { TabMenuService } from './tab-menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-menu.component.html',
  styleUrl: './tab-menu.component.scss'
})

export class TabMenuComponent implements OnInit {

  activeTab: string = 'personal';

  constructor(private tabMenuService: TabMenuService) { }

  ngOnInit(): void {
    this.tabMenuService.activeTab$.subscribe((value: string) => {
      this.activeTab = value;
    })
  }

  setActiveTab(value: string) {
    this.tabMenuService.setActiveTab(value);
  }

}
