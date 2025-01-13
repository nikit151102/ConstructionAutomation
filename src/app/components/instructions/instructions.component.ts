import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { InstructionsService } from './instructions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})

export class InstructionsComponent implements OnInit {

  @Input() getInstruction: string = '';
  instructionContent: string = '';

  constructor(public instructionsService:InstructionsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['getInstruction'] && !changes['getInstruction'].isFirstChange()) {
      this.loadInstruction(changes['getInstruction'].currentValue);
    }
  }
  
  ngOnInit(): void {
    this.loadInstruction(this.getInstruction); 
  }

  loadInstruction(filename: string): void {
    this.instructionsService.getInstructionHtml(filename).subscribe((content) => {
      this.instructionContent = content; 
    });
  }

}
