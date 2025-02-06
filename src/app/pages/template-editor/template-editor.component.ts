import { Component } from '@angular/core';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss'
})
export class TemplateEditorComponent {
  redirectTo(url: string) {
    window.location.href = url;
  }

}
