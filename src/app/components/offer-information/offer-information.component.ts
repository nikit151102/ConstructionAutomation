import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-offer-information',
  standalone: true,
  imports: [],
  templateUrl: './offer-information.component.html',
  styleUrl: './offer-information.component.scss'
})
export class OfferInformationComponent {

  constructor(private location: Location) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  goBack(): void {
    this.location.back();
  }

}
