import { HttpClient, HttpParams } from '@angular/common/http';
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
  getJobEmails(companyId: string, pageNo: number, keyword: string): Observable<any> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('pageNo', pageNo.toString())
      .set('keyword', keyword);
  
    return this.http.get<any>(this.apiUrl, { params });
  }
  
}

