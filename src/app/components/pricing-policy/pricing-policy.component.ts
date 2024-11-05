import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-policy.component.html',
  styleUrl: './pricing-policy.component.scss'
})
  export class PricingPolicyComponent {
    isContentVisible = false; // State to manage visibility of the content
  
    toggleContent() {
      this.isContentVisible = !this.isContentVisible; // Toggle the state
    }
  }


