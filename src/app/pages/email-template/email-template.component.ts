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
  
  emailTemplates: WritableSignal<{  templateID: number; name: string; lastUpdated: Date }[]> = signal([]);
  constructor(private communicationService: CommunicationService, private router: Router) {}
  rowHoverIndex: number | null = null;
  companyId: string = ''; 
  ngOnInit(): void {
    this.companyId = history.state.companyId || this.communicationService.getCompanyId();
    this.loadEmailTemplates(this.companyId);
 
  }
  onRowHover(index: number) {
    this.rowHoverIndex = index;
  }

  onRowLeave() {
    this.rowHoverIndex = null;
  }
  loadEmailTemplates(companyId: string): void {
    this.communicationService.getEmailTemplates(companyId).subscribe(templates => {
      this.emailTemplates.set(
        templates.map(template => ({
          templateID: template.templateID,
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

  viewTemplate(templateID: number) {
    this.router.navigate(['/template-viewer'], { queryParams: { templateID: templateID, companyId: this.companyId } });
  }
}
