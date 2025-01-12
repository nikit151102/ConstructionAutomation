import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  constructor(private location: Location) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  goBack(): void {
    this.location.back();
  }
}
