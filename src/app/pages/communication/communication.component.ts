import { Component, Input, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommunicationService } from '../../Services/communication.service';
import { CommonModule, DatePipe } from '@angular/common';
interface Job {
  title: string;
  publishedDate: Date;
  sentEmails: number;
  readEmails: number;
}
@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [HeaderComponent,ReactiveFormsModule , CommonModule],
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.scss'
})
export class CommunicationComponent implements OnInit {
  jobs: Job[] = [];
  sentEmails = signal({ cv: 0, applicants: 0, invitation: 0 });
  readEmails = signal({ cv: 0, applicants: 0, invitation: 0 });
  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.fetchEmails();
    this.fetchJobs();
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  }
  redirectTo(url: string) {
    window.location.href = url;
  }
  fetchJobs(searchQuery: string = ''): void {
    this.communicationService.getJobEmails(searchQuery, this.currentPage, this.pageSize)
      .subscribe(response => {
        if (response.jobs && response.jobs.length > 0) {
          this.jobs = response.jobs;
        } else {
          this.jobs = []; 
        }
      });
  }

  onSearch(): void {
    const query = this.searchControl.value?.trim();
    this.fetchJobs(query);
  }

  changePage(direction: number): void {
    this.currentPage += direction;
    this.fetchJobs();
  }
  fetchEmails(): void {
    this.communicationService.getEmailsOverview('ZxU0PRC%3D').subscribe(response => {
      if (response.responseType === 'success' && response.data?.list) {
        this.jobs = response.data.list.map((item: any) => ({
          title: item.job,
          publishedDate: new Date(item.publishDate),
          sentEmails: item.sentEmail,
          readEmails: item.readEmail
        }));
  
        this.sentEmails.set({
          cv: response.data.emailCVbank,
          applicants: response.data.emailByJobs,
          invitation: response.data.invited
        });
  
        this.readEmails.set({
          cv: response.data.readEmailCVbank,
          applicants: response.data.readEmailbyJobs,
          invitation: response.data.invitedRead
        });
      }
    });
  }
  
}

