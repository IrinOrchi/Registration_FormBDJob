import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from '../../Services/communication.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [DatePipe,CommonModule, ReactiveFormsModule],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss'
})
export class TemplateEditorComponent {
   templateDetails: WritableSignal<{ name: string; lastUpdated: Date; content: string } | null> = signal(null);
    templateID!: number;
    companyId!: string;
    templateForm!: FormGroup;

    constructor(
      private route: ActivatedRoute, private communicationService: CommunicationService,private fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.templateID = params['templateID'];
        this.companyId = params['companyId'];
        if (this.templateID) {
          this.loadTemplate();
        }
      });
      this.templateForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(15)]],
        content: ['', [Validators.required, Validators.maxLength(3000)]],
      });
    }
  
    loadTemplate() {
      this.communicationService.getemailTemplateById(this.companyId, this.templateID).subscribe(
        (response) => {
          if (response.responseType === 'success' && response.data) {
            const { templateTitle, updatedOn, templateText } = response.data;
            
            this.templateDetails.set({
              name: templateTitle,
              lastUpdated: new Date(updatedOn),
              content: templateText
            });
  
            // Update form fields dynamically
            this.templateForm.patchValue({
              name: templateTitle,
              content: templateText
            });
          }
        },
        (error) => {
          console.error('Error loading template:', error);
        }
      );
    }
  
    saveTemplate() {
      if (this.templateForm.invalid) return;
  
      const updatedTemplate = {
        templateID: this.templateID,
        templateTitle: this.templateForm.value.name,
        templateText: this.templateForm.value.content,
        companyId: this.companyId, 
        updatedOn: new Date(),
      };
  
      this.communicationService.emailTemplateUpdate(this.companyId, updatedTemplate).subscribe(
        (response) => {
          if (response.responseCode === 1) { 
            alert('Template updated successfully!');
            this.loadTemplate();
          } else {
            console.error('Error in response:', response);
          }
        },
        (error) => {
          console.error('Error updating template:', error);
        }
      );
    }
  
  redirectTo(url: string) {
    window.location.href = url;
  }
 
}
