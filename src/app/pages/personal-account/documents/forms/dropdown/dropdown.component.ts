import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})

export class DropdownComponent {

  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() control!: FormControl;
  
}
