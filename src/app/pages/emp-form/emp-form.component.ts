import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from "../../components/input-field/input-field.component";
import { CaptureImageComponent } from '../../components/capture-image/capture-image.component';

@Component({
  selector: 'app-emp-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputFieldComponent, CaptureImageComponent, FormsModule,CommonModule],
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.scss']
})
export class EmpFormComponent {
  
  // Correct FormGroup Initialization with FormControl
  empForm = new FormGroup({
    nidNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10,17}$/)]),  // Ensure correct form control
    dob: new FormControl('', Validators.required),  // No array here, use FormControl
    base64image: new FormControl('')  // Use a string directly in FormControl
  });

  // Optional: Use form control's valueChanges instead of signals
  constructor() {
    this.empForm.controls['nidNumber'].valueChanges.subscribe(value => {
      console.log('NID Number changed:', value);
    });
  }

  // Handle Form Submission
  onSubmit() {
    if (this.empForm.valid) {
      console.log(this.empForm.value);
    } else {
      console.error('Form is invalid');
    }
  }

  // Handle Image Capture from Child Component
  handleImageCapture(image: string) {
    this.empForm.controls['base64image'].setValue(image); 
  }
}
