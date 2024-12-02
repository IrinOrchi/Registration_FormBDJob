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
      const selectedId = changes['selectedIndustryId'].currentValue;
      if (this.employeeForm.get('industryType')) {
        this.employeeForm.get('industryType')?.setValue(selectedId, { emitEvent: false });
        this.cdr.detectChanges();
      }
    }
  }

  addIndustry(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const organizationRequest: IndustryType = {
        IndustryId: this.selectedIndustryId,
        IndustryName: formValue.industryName,
        OrganizationName: formValue.industryName,
      };

      this.newIndustry.emit(organizationRequest);
      this.closeModal();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
