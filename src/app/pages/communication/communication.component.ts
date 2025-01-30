import { Component, Input, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ReactiveFormsModule } from '@angular/forms';
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

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.fetchEmails();
  }
  redirectTo(url: string) {
    window.location.href = url;
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

