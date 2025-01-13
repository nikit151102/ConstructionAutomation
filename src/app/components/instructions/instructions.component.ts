import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.loadInstruction(this.getInstruction); 
  }

  loadInstruction(filename: string): void {
    this.instructionsService.getInstructionHtml(filename).subscribe((content) => {
      this.instructionContent = content; 
    });
  }

}
