import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  imports: [HeaderComponent,ReactiveFormsModule ,DatePipe, CommonModule],
  templateUrl: './communication.component.html',
  styleUrl: './communication.component.scss'
})
export class CommunicationComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchControl = new FormControl('');
  currentPage = 1;
  itemsPerPage = 5;
  totalPages: number[] = [];
  sentEmails = {
    cv: 125,
    applicants: 5,
    invitation: 0,
  };

  readEmails = {
    cv: 84,
    applicants: 0,
    invitation: 0,
  };
  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.communicationService.getJobs().subscribe((data: Job[]) => {
      this.jobs = data;
      this.filteredJobs = [...this.jobs];
      this.updatePagination();
    });
  }

  filterJobs() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredJobs = this.jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm)
    );
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Array(Math.ceil(this.filteredJobs.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}


