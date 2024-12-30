import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legal-information',
  standalone: true,
  imports: [],
  templateUrl: './legal-information.component.html',
  styleUrl: './legal-information.component.scss'
})
export class LegalInformationComponent {

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['optionalParam'];
      console.log(' parameter :', id);
    });
  }
  
}
