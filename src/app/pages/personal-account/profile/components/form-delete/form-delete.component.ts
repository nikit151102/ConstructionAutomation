import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-delete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-delete.component.html',
  styleUrl: './form-delete.component.scss'
})
export class FormDeleteComponent {
  deleteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.deleteForm = this.fb.group({
      confirm: [false, Validators.requiredTrue]  
    });
  }

  onSubmit(): void {
    if (this.deleteForm.valid) {
      console.log('Account deleted!');
      
      // this.router.navigate(['/goodbye']);  
    }
  }
}
