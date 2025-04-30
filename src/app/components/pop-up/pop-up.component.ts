import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit{
 
  @Input() imageSrc: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() offerInformation: boolean = true;
  @Input() buttons: { label: string, onClick: () => void }[] = [];
  @Input() price: any;
  @Output() close = new EventEmitter<void>();
  freeGenerating: any;
  
  constructor(private personalAccountService:PersonalAccountService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.personalAccountService.freeGenerating$.subscribe((value: string) => {
      this.freeGenerating = value;
      this.cdr.detectChanges();
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
