import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private apiUrl = 'https://api.example.com/jobs'; // Replace with actual API endpoint

  constructor(private http: HttpClient) {}

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

