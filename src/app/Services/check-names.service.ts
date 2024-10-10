import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CompanyNameCheckRequest, CompanyNameCheckResponse } from '../Models/company';

@Injectable({
  providedIn: 'root'
})
export class CheckNamesService {

  private apiUrl = 'https://localhost:7240/api/Account/CheckNames';

  constructor(private http: HttpClient) { }

  checkUniqueCompanyName(body: any): Observable<any> {
    return this.http.post(this.apiUrl, body)
  }

  checkUsernameAndCompanyName(userName: string, companyName: string): Observable<any> {
    const params = new HttpParams()
      .set('userName', userName)
      .set('companyName', companyName);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      debounceTime(500),  // wait 500ms after the last keyup event
      catchError(err => {
        console.error('Error checking names', err);
        return of(null);  // return null in case of error
      })
    );
  }
}
