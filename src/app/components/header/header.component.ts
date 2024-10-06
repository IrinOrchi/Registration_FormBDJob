import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component'; // Import ModalComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ModalComponent,CommonModule]  // Import ModalComponent here
})
export class HeaderComponent {
  isDropdownOpen: boolean = false;
  hasCredit: boolean = false;
  showReferralError: boolean = false;
  activeModal: string | null = null;

  // Toggles dropdown visibility
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Opens the specified modal
  openModal(modalId: string) {
    this.activeModal = modalId;
  }

  // Closes the currently open modal
  closeModal() {
    this.activeModal = null;
  }

  // Simulates submitting a referral code
  submitReferralCode() {
    // Fake validation for referral code
    this.showReferralError = true;
    // Simulate a successful submission after some time
    setTimeout(() => {
      this.showReferralError = false;
      this.openModal('crdtSuccess'); // Open success modal
    }, 1000);
  }
 
  isUserDropdownOpen = false;

  // Toggles the User dropdown
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
}
