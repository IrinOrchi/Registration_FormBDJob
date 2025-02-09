import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommunicationService } from '../../Services/communication.service';

@Component({
  selector: 'app-sent-emails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sent-emails.component.html',
  styleUrl: './sent-emails.component.scss'
})
export class SentEmailsComponent {
  emails: any[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.loadSentEmails();
  }

  loadSentEmails(): void {
    const companyId = this.communicationService.getCompanyId();
    
    if (!companyId) {
      console.error('Company ID is missing');
      return;
    }

    this.communicationService.getemailsinbox(companyId).subscribe({
      next: (response) => {
        if (response.responseType === 'success' && response.data) {
          this.emails = response.data.emails;
          this.totalRecords = response.data.totalRecords;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (error) => {
        console.error('Error fetching sent emails:', error);
      }
    });
  }
}


