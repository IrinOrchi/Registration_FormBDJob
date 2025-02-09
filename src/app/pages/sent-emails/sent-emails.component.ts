import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sent-emails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sent-emails.component.html',
  styleUrl: './sent-emails.component.scss'
})
export class SentEmailsComponent {
  emails = [
    { name: 'One Test Name', subject: 'CV bank detail send', date: '2 Oct 2017' },
    { name: 'One Test Name', subject: 'CV summary', date: '2 Oct 2017' },
    { name: 'Mst. Dilruba Khatun', subject: 'Invite test purpose CV detail', date: '27 Sep 2017' },
    { name: 'Test tank', subject: 'CV details', date: '13 Aug 2017' },
    { name: 'Susmita Mridha', subject: 'CV send mail', date: '8 May 2017' },
    { name: 'Susmita Mridha', subject: 'CV summary', date: '8 May 2017' },
    { name: 'Shuvashis Ghosh', subject: 'Test', date: '2 Apr 2017' },
    { name: 'Rukaia Rafa', subject: 'Test', date: '25 Feb 2017' },
    { name: 'Mst. Dilruba Khatun', subject: 'App test summary CV', date: '29 Jan 2017' },
    { name: 'Ayesha Siddiqua', subject: 'kjgh', date: '29 Oct 2016' }
  ];

}
