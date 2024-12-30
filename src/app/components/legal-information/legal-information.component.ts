import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-information',
  standalone: true,
  imports: [],
  templateUrl: './legal-information.component.html',
  styleUrl: './legal-information.component.scss'
})
export class LegalInformationComponent {

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['optionalParam'];
    });
  }

  goBack(): void {
    this.location.back();
  }

}
