import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IndustryType } from '../../Models/company';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-add-industry-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-industry-modal.component.html',
  styleUrls: ['./add-industry-modal.component.scss']
})
export class AddIndustryModalComponent implements OnChanges {
  @Input() closeModal!: () => void;
  @Input() industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  @Output() newIndustry = new EventEmitter<IndustryType>();
  @Input() selectedIndustryId: number = 0;

  employeeForm: FormGroup;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.employeeForm = this.fb.group({
      industryType: ['', Validators.required],
      industryName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndustryId']) {
      console.log('Child Component - Selected Industry ID:', changes['selectedIndustryId'].currentValue);
      const selectedId = changes['selectedIndustryId'].currentValue;
      if (this.employeeForm.get('industryType')) {
        this.employeeForm.get('industryType')?.setValue(selectedId, { emitEvent: false });
        console.log('Modal Form Updated with Industry ID:', selectedId);
        this.cdr.detectChanges(); 
      }
    }
  }
  addIndustry(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const newIndustry: IndustryType = {
        IndustryId: Date.now(),
        IndustryName: formValue.industryName,
      };

      this.newIndustry.emit(newIndustry);
      this.closeModal();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
