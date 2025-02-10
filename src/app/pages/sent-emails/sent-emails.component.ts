import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  currentPage: number = 1;
  pageSize: number = 10; 

  
  selectedEmailCategory = signal<string>('cv'); 
  selectedReadStatus = signal<string>('all'); 

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.loadSentEmails(this.currentPage);
  }

  loadSentEmails(pageNo: number): void {
    const companyId = this.communicationService.getCompanyId();
    const r_Type = this.getReadStatusValue(this.selectedReadStatus()) ?? 0;

    this.communicationService.getemailsinbox(companyId, pageNo, this.selectedEmailCategory(), this.pageSize, r_Type)
      .subscribe({
        next: (response) => {
          if (response.responseType === 'success' && response.data) {
            this.emails = response.data.emails;
            this.totalRecords = response.data.totalRecords;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.currentPage = pageNo;
          }
        },
        error: (error) => {
          console.error('Error fetching sent emails:', error);
        },
      });
  }

  goToPage(pageNo: number): void {
    if (pageNo >= 1 && pageNo <= this.totalPages) {
      this.loadSentEmails(pageNo);
    }
  }

  updateEmailCategory(category: string): void {
    this.selectedEmailCategory.set(category);
    this.loadSentEmails(1); 
  }

  updateReadStatus(status: string): void {
    this.selectedReadStatus.set(status);
    this.loadSentEmails(1);
  }

  getReadStatusValue(status: string): number | null {
    if (status === 'read') return 1;
    if (status === 'unread') return 0;
    return null; 
  }
}