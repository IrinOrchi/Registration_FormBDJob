import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EmailTemplate } from '../Models/communication';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private apiUrl = 'https://localhost:7004/api/EmailsOverview/GetSentEmails';
  private jobEmailsUrl = 'https://localhost:7004/api/EmailTemplate/EmailTemplates';
  private viewTemplatesUrl = 'https://localhost:7004/api/EmailTemplate/EmailTemplateViewer';
  private emailTemplateUrl = 'https://localhost:7004/api/EmailTemplate/EmailTemplateEditor';
  private emailUpdateTemplateUrl = 'https://localhost:7004/api/EmailTemplate/UpdateEmailTemplate';
  private getemailsinboxUrl = 'https://localhost:7004/api/EmailsOverview/GetEmailsInbox';

  constructor(private http: HttpClient) {}

  setCompanyId(companyId: string): void {
    sessionStorage.setItem('companyId', companyId);
  }
  getCompanyId(): string {
    return sessionStorage.getItem('companyId') || ''; 
  }
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

  getEmailTemplates(companyId: string): Observable<EmailTemplate[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<any>(this.jobEmailsUrl, { params }).pipe(
      map((response: any) => response.data?.emailTemplates || [])
    );
  }
  
  getTemplateById(companyId: string, templateID: number): Observable<any> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('templateID', templateID);
    
    return this.http.get<any>(this.viewTemplatesUrl, { params });
  }
  getemailTemplateById(companyId: string, templateID: number): Observable<any> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('templateID', templateID);
    
    return this.http.get<any>(this.emailTemplateUrl, { params });
  }
  emailTemplateUpdate(companyId: string, templateData: any): Observable<any> {
    return this.http.post<any>(this.emailUpdateTemplateUrl, { companyId, ...templateData });
  }
  getemailsinbox(companyId: string, c_Type: string = 'cv',): Observable<any> {
    const params = new HttpParams()
      .set('companyId', companyId)
      .set('c_Type', c_Type);
    
    return this.http.get<any>(this.getemailsinboxUrl, { params });
  }
}

