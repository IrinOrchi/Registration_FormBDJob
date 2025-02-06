import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-email-template-modal',
  standalone: true,
  imports: [],
  templateUrl: './email-template-modal.component.html',
  styleUrl: './email-template-modal.component.scss'
})
export class EmailTemplateModalComponent {
  isOpen: WritableSignal<boolean> = signal(false);

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }

}
