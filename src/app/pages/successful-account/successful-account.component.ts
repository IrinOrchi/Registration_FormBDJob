import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { AuthService } from '../../Services/shared/auth.service';

@Component({
  selector: 'app-successful-account',
  standalone: true,
  templateUrl: './successful-account.component.html',
  styleUrls: ['./successful-account.component.scss'],
})
export class SuccessfulAccountComponent implements OnInit {
  userName: string = '';
  password: string = '';
  loginFormErrorMessage: string = '';
  isLoginApiCallPending = false;
  queryString: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.queryString = urlParams.get('selectedJobType') || '';
  }

  ngOnInit(): void {
    const storedCredentials = this.authService.getCredentials();
    if (storedCredentials.username && storedCredentials.password) {
      this.userName = storedCredentials.username;
      this.password = storedCredentials.password;
    }
  }

  onClickLoginButton(): void {
    this.loginFormErrorMessage = '';

    if (!this.userName || !this.password) {
      this.loginFormErrorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoginApiCallPending = true;
    this.loginService.loginUser(this.userName, this.password).subscribe({
      next: (data) => {
        if (data?.status === 200 && data?.message === 'User logged in successfully.') {
          this.handleSuccessfulLogin();
        } else {
          this.loginFormErrorMessage = data?.message || 'An unknown error occurred.';
          this.isLoginApiCallPending = false;
        }
      },
      error: () => {
        this.loginFormErrorMessage = "Couldn't connect to the server.";
        this.isLoginApiCallPending = false;
      },
    });
  }

  private handleSuccessfulLogin(): void {
    this.loginService.setCookies().subscribe({
      next: (cookieResponse) => {
        if (cookieResponse) {
          this.redirectToDashboard();
        } else {
          this.loginFormErrorMessage = 'Failed to set cookies.';
          this.isLoginApiCallPending = false;
        }
      },
      error: () => {
        this.loginFormErrorMessage = "Couldn't set cookies.";
        this.isLoginApiCallPending = false;
      },
    });
  }

  private redirectToDashboard(): void {
    const baseUrl = 'https://recruiter.bdjobs.com/dashboard';
    const redirectUrl = this.queryString
      ? `${baseUrl}?selectedJobType=${encodeURIComponent(this.queryString)}`
      : baseUrl;

    window.location.href = redirectUrl; 
  }
}
