import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrentUserService } from '../../../../../services/current-user.service';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements AfterViewInit{


  @Input() id: string = '';
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() controlName: string = '';
  
  constructor(private currentUserService:CurrentUserService){}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.id === 'Inn') {
        const currentUserData = this.currentUserService.getUser();
        if (currentUserData && currentUserData.inn) {
          this.control.setValue(currentUserData.inn);
        }
      }
      else if (this.id === 'registerNumber') {
        const currentUserData = this.currentUserService.getUser();
        if (currentUserData && currentUserData.registerNumber) {
          this.control.setValue(currentUserData.registerNumber);
        }
      }
      
    });
  }
  

}
