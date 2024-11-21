import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IndustryType } from '../../Models/company';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-add-industry-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-industry-modal.component.html',
  styleUrls: ['./add-industry-modal.component.scss']
})
export class AddIndustryModalComponent implements OnChanges {
  @Input() closeModal!: () => void;
  @Input() industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  @Output() newIndustry = new EventEmitter<IndustryType>();
  @Input() selectedIndustryId!: number;

  addIndustryForm: FormGroup;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.addIndustryForm = this.fb.group({
      industryType: ['', Validators.required],
      industryName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndustryId'] && changes['selectedIndustryId'].currentValue !== undefined) {
      const selectedId = changes['selectedIndustryId'].currentValue;
  
      if (this.addIndustryForm.get('industryType')) {
        this.addIndustryForm.get('industryType')?.setValue(selectedId, { emitEvent: false });
        console.log('Modal Component - Form Updated with Industry ID:', selectedId);
  
        // Trigger UI update
        this.cdr.detectChanges();
      }
    }
  }
  
  addIndustry(): void {
    if (this.addIndustryForm.valid) {
      const formValue = this.addIndustryForm.value;
      const newIndustry: IndustryType = {
        IndustryId: Date.now(),
        IndustryName: formValue.industryName,
      };

      this.newIndustry.emit(newIndustry);
      this.closeModal();
    } else {
      this.addIndustryForm.markAllAsTouched();
    }
  }
}
