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
  loading = signal<boolean>(false); 


  selectedEmailCategory = signal<string>('cv');
  selectedReadStatus = signal<string>('all');
  isInviteChecked = signal<boolean>(false); 

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.loadSentEmails(this.currentPage);
  }

  loadSentEmails(pageNo: number): void {
    this.loading.set(true);
    const companyId = this.communicationService.getCompanyId();
    const r_Type = this.getReadStatusValue(this.selectedReadStatus()) ?? 0;

    let category = this.selectedEmailCategory();
    if (this.isInviteChecked()) {
      category = 'iv'; 
    }

    this.communicationService.getemailsinbox(companyId, pageNo, category, this.pageSize, r_Type)
      .subscribe({
        next: (response) => {
          if (response.responseType === 'success' && response.data) {
            this.emails = response.data.emails;
            this.totalRecords = response.data.totalRecords;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.currentPage = pageNo;
          }
          this.loading.set(false);
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
    this.isInviteChecked.set(false); 
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

  isInviteDisabled(): boolean {
    return this.selectedEmailCategory() === 'cv';
  }

  toggleInviteSelection(): void {
    if (!this.isInviteDisabled()) {
      this.isInviteChecked.set(!this.isInviteChecked());
      this.loadSentEmails(1);
    }
  }
}