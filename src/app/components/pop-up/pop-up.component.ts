import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent {
  @Input() imageSrc: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() offerInformation: boolean = true;
  @Input() buttons: { label: string, onClick: () => void }[] = [];
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
