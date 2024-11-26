import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private username: string | null = null;
  private password: string | null = null;

  setUsername(username: string): void {
    this.username = username;
    console.log('Username stored:', this.username);
  }

  setPassword(password: string): void {
    this.password = password;
    console.log('Password stored:', this.password);
  }

  getUsername(): string | null {
    return this.username;
  }

  getPassword(): string | null {
    return this.password;
  }
}
