import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDeleteService } from './form-delete.service';

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
    private router: Router,
    private formDeleteService: FormDeleteService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.deleteForm = this.fb.group({
      confirm: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.deleteForm.valid) {
      const id = localStorage.getItem('VXNlcklk');
      console.log('id',id)
      if (id) {
        this.formDeleteService.deleteUser(id).subscribe(
          () => {
            localStorage.removeItem('YXV0aFRva2Vu');
            localStorage.removeItem('VXNlcklk');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error deleting account:', error);
          }
        );
      } else {
        console.warn('No user ID found in the route parameters.');
      }
    }
  }

}
