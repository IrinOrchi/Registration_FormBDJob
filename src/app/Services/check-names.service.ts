import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; 
import { CheckNamesResponseDTO, CompanyNameCheckRequestDTO, IndustryTypeResponseDTO, IndustryTypeRequestDTO, IndustryType, LocationRequestDTO, LocationResponseDTO } from '../Models/company';

@Injectable({
  providedIn: 'root',
})
export class CheckNamesService {
  private apiUrl = 'https://localhost:7240/api/Account/CheckNames'; 
  private industryApiUrl = 'https://localhost:7240/api/IndustryType/GetIndustryType'; 
  private industryIdApiUrl = 'https://localhost:7240/api/IndustryType/GetAllIndustrieIds';


  constructor(private http: HttpClient) {}

  // Check for unique username
  checkUniqueUserName(userName: string): Observable<CheckNamesResponseDTO> {
    if (!userName || userName.length < 3 || userName.length > 20) {
      return throwError(() => new Error('UserName must be between 3 and 20 characters.'));
    }

    const request: CompanyNameCheckRequestDTO = {
      UserName: userName, 
      CheckFor: 'u', 
      CompanyName: ''
    };

    return this.http.post<CheckNamesResponseDTO>(this.apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error checking username:', error);
        return throwError(() => new Error('Error checking username'));
      })
    );
  }

  // Check for unique company name
  checkUniqueCompanyName(companyName: string): Observable<CheckNamesResponseDTO> {
    if (!companyName) {
      return throwError(() => new Error('CompanyName is required.'));
    }

    const request: CompanyNameCheckRequestDTO = {
      UserName: '',  
      CheckFor: 'c', 
      CompanyName: companyName
    };

    return this.http.post<CheckNamesResponseDTO>(this.industryIdApiUrl, request).pipe(
      catchError((error) => {
        console.error('Error checking company name:', error);
        return throwError(() => new Error('Error checking company name'));
      })
    );
  }
   // Fetch industry types from API using POST method
  fetchIndustryTypes(IndustryId?: number): Observable<IndustryTypeResponseDTO[]> {
    const request: IndustryTypeRequestDTO = {
      IndustryId: IndustryId ?? undefined,  
      OrganizationText: '',                 
      CorporateID: undefined                
    };

    return this.http.post<IndustryTypeResponseDTO[]>(this.industryApiUrl, request).pipe(
      catchError((error) => {
        console.error('Error fetching industry types:', error);  // Log the error for debugging
        return throwError(() => new Error('Error fetching industry types'));
      })
    );
  }

  fetchIndustryNamesByType(industryId: number): Observable<IndustryTypeResponseDTO[]> {
    // Send the selected IndustryId
    const request: IndustryTypeRequestDTO = {
      IndustryId: industryId,  
      OrganizationText: '',   // Optional data if needed
      CorporateID: undefined  // Optional data if needed
    };
  
    return this.http.post<IndustryTypeResponseDTO[]>(this.industryApiUrl, request).pipe(
      catchError((error) => {
        console.error('Error fetching industry names:', error);
        return throwError(() => new Error('Error fetching industry names'));
      })
    );
  }
 //Industry Ids
 getAllIndustryIds(): Observable<IndustryType[]> {
  return this.http.get<any>(this.industryIdApiUrl).pipe(
    catchError((error) => {
      console.error('Error fetching industries:', error);
      return throwError(() => new Error('Failed to fetch industries'));
    })
  );
}
  // Method to get locations (districts, countries, or thanas)
  getLocations(requestPayload: LocationRequestDTO): Observable<LocationResponseDTO[]> {
    return this.http.post<LocationResponseDTO[]>(this.apiUrl, requestPayload).pipe(
      // Handle errors here
      catchError((error) => {
        console.error('Error fetching locations', error);
        return throwError(() => new Error('Error fetching locations'));
      })
    );
  }

  // Helper method to create payload
  private createRequestPayload(outsideBd: boolean, districtId: string = ''): LocationRequestDTO {
    return {
      OutsideBd: outsideBd ? '1' : '0',
      DistrictId: districtId,
    };
  }

  // Fetch all countries or districts based on outsideBd
  fetchDistrictsOrCountries(outsideBd: boolean): Observable<LocationResponseDTO[]> {
    const requestPayload = this.createRequestPayload(outsideBd);
    return this.getLocations(requestPayload);
  }

  // Fetch thanas based on districtId
  fetchThanas(districtId: string): Observable<LocationResponseDTO[]> {
    const requestPayload = this.createRequestPayload(false, districtId);
    return this.getLocations(requestPayload);
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { LocationRequestDTO, LocationResponseDTO } from '../Models/company';

// @Injectable({
//   providedIn: 'root',
// })
// export class CheckNamesService {
//   // Use environment variable for the API URL
//   private apiUrl = 'https://localhost:7119/api/Location/GetLocations'; // Replace with your actual API URL or use environments

//   constructor(private http: HttpClient) {}

//   // Method to get locations (districts, countries, or thanas)
//   getLocations(requestPayload: LocationRequestDTO): Observable<LocationResponseDTO[]> {
//     return this.http.post<LocationResponseDTO[]>(this.apiUrl, requestPayload).pipe(
//       // Handle errors here
//       catchError((error) => {
//         console.error('Error fetching locations', error);
//         return throwError(() => new Error('Error fetching locations'));
//       })
//     );
//   }

//   // Helper method to create payload
//   private createRequestPayload(outsideBd: boolean, districtId: string = ''): LocationRequestDTO {
//     return {
//       OutsideBd: outsideBd ? '1' : '0',
//       DistrictId: districtId,
//     };
//   }

//   // Fetch all countries or districts based on outsideBd
//   fetchDistrictsOrCountries(outsideBd: boolean): Observable<LocationResponseDTO[]> {
//     const requestPayload = this.createRequestPayload(outsideBd);
//     return this.getLocations(requestPayload);
//   }

//   // Fetch thanas based on districtId
//   fetchThanas(districtId: string): Observable<LocationResponseDTO[]> {
//     const requestPayload = this.createRequestPayload(false, districtId);
//     return this.getLocations(requestPayload);
//   }
// }
