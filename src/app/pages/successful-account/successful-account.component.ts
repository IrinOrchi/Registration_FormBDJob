import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-successful-account',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './successful-account.component.html',
  styleUrl: './successful-account.component.scss'
})
export class SuccessfulAccountComponent {
  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}


