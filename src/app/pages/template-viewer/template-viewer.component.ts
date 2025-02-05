import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from '../../Services/communication.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-template-viewer',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './template-viewer.component.html',
  styleUrl: './template-viewer.component.scss'
})
export class TemplateViewerComponent {
  templateDetails: WritableSignal<{ name: string; lastUpdated: Date; content: string } | null> = signal(null);
  templateID!: number;
  companyId!: string;
  constructor(
    private route: ActivatedRoute, private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.templateID = params['templateID'];
      this.companyId = params['companyId'];
      if (this.templateID) {
        this.loadTemplate();
      }
    });
  }

  loadTemplate() {
    this.communicationService.getTemplateById(this.companyId, this.templateID).subscribe(
      (response) => {
        if (response.responseType === 'success' && response.data) {
          this.templateDetails.set({
            name: response.data.templateTitle, 
            lastUpdated: new Date(response.data.updatedOn),
            content: response.data.templateText 
          });
        }
      },
      (error) => {
        console.error('Error loading template:', error);
      }
    );
  }
  
  editTemplate() {
    console.log('Editing template:', this.templateID);
  }
  redirectTo(url: string) {
    window.location.href = url;
  }

}
