import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommunicationService } from '../../Services/communication.service';
import { CommonModule, DatePipe } from '@angular/common';
interface Job {
  id: number;
  title: string;
  publishedDate: string;
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
  sentEmails = signal({ cv: 0, applicants: 0, invitation: 0 });
  readEmails = signal({ cv: 0, applicants: 0, invitation: 0 });

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.communicationService.getEmailsOverview('ZxU0PRC%3D').subscribe(response => {
      if (response.responseType === 'success') {
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

