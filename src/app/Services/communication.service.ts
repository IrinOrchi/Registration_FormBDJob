import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private apiUrl = 'https://localhost:7004/api/EmailsOverview/GetSentEmails';

  constructor(private http: HttpClient) {}

  getEmailsOverview(companyId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?companyId=${companyId}`);
  }
  getJobEmails(searchQuery: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${searchQuery}&page=${page}&pageSize=${pageSize}`);
  }
}

