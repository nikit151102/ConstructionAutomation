import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [],
  templateUrl: './date.component.html',
  styleUrl: './date.component.scss'
})
export class DateComponent {

  @Input() name: string = '';
  @Input() label: string = '';

  @Output() selectedDate = new EventEmitter<string>();

  value: string = '';
  
  onDateChange(event: any): void {
    const selectedDate = event.target.value;
  
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${selectedDate}T${hours}:${minutes}:${seconds}`;
  
    this.selectedDate.emit(formattedDate);
  }
  

}
