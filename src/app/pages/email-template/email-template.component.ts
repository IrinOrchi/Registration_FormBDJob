import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './email-template.component.html',
  styleUrl: './email-template.component.scss'
})
export class EmailTemplateComponent {
  
  emailTemplates: WritableSignal<{ name: string; lastUpdated: Date }[]> = signal([
    { name: 'Last Update : F', lastUpdated: new Date(2024, 11, 26) },
    { name: 'test2', lastUpdated: new Date(2024, 11, 3) },
    { name: 'test-mim', lastUpdated: new Date(2024, 10, 21) },
    { name: 'Email Template', lastUpdated: new Date(2024, 0, 20) },
    { name: 'tempet-113', lastUpdated: new Date(2023, 0, 17) },
    { name: 'testtt', lastUpdated: new Date(2021, 9, 19) },
    { name: 'testing-40', lastUpdated: new Date(2020, 10, 29) },
    { name: 'ab_bn', lastUpdated: new Date(2020, 10, 5) },
    { name: 'Test 6', lastUpdated: new Date(2017, 2, 9) },
    { name: 'Test Template', lastUpdated: new Date(2017, 2, 8) },
  ]);

  get emailTemplatesList() {
    return this.emailTemplates(); 
  }
  
  redirectTo(url: string) {
    window.location.href = url;
  }
}