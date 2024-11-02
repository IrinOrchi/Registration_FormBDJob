import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss'
})
export class RadioGroupComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() options: string[] = [];
  @Input() isRequired: boolean = false;
  @Input() errorMessage: string = '';

}
