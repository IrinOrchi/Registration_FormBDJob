import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { CommunicationService } from '../../Services/communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './email-template.component.html',
  styleUrl: './email-template.component.scss'
})
export class EmailTemplateComponent {
  
  emailTemplates: WritableSignal<{ name: string; lastUpdated: Date }[]> = signal([]);
  constructor(private communicationService: CommunicationService, private router: Router) {}

  ngOnInit(): void {
    const companyId = history.state.companyId; 

    if (companyId) {
      this.loadEmailTemplates(companyId);  
    }  
  }

  loadEmailTemplates(companyId: string): void {
    this.communicationService.getEmailTemplates(companyId).subscribe(templates => {
      this.emailTemplates.set(
        templates.map(template => ({
          name: template.tmplateTitle,
          lastUpdated: new Date(template.updatedOn)
        }))
      );
    });
  }
  get emailTemplatesList() {
    return this.emailTemplates(); 
  }
  
  redirectTo(url: string) {
    window.location.href = url;
  }
}