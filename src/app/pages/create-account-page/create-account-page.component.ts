
import { Component, computed, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CheckNamesService } from '../../Services/check-names.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { SelectFieldComponent } from '../../components/select-field/select-field.component';
import { TextAreaComponent } from '../../components/text-area/text-area.component';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';
import { JsonPipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { IndustryTypeResponseDTO, IndustryType } from '../../Models/company';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [
    InputFieldComponent,
    SelectFieldComponent,
    TextAreaComponent,
    CheckboxGroupComponent,
    ReactiveFormsModule,
    JsonPipe, CommonModule,
  ],
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent implements OnInit {
  industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  
  // Form Group with Reactive Form
    employeeForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    companyName: new FormControl('', [Validators.required]),
    industryType: new FormControl('') 
  });

  usernameControl = computed(() => this.employeeForm.get('username') as FormControl<string>);
  companyNameControl = computed(() => this.employeeForm.get('companyName') as FormControl<string>);
  industryTypeControl = computed(() => this.employeeForm.get('industryType') as FormControl<string>);

  usernameExistsMessage: string = '';
  companyNameExistsMessage: string = '';

  // Initialize as empty arrays to ensure they are iterable
  industryTypes: IndustryTypeResponseDTO[] = [];
  filteredIndustryTypes: IndustryTypeResponseDTO[] = [];
  industriesData: IndustryType[] = [];

  searchControl: FormControl = new FormControl('');  // Form control for search input
  private usernameSubject: Subject<string> = new Subject();
  private companyNameSubject: Subject<string> = new Subject();

  constructor(private checkNamesService: CheckNamesService) {}

  ngOnInit(): void {
    this.setupUsernameCheck();
    this.setupCompanyNameCheck();
    this.fetchIndustries();
    this.setupSearch();
    this.fetchIndustryTypes();

    // Bind the dropdown selection to filter the industry values
    this.employeeForm.get('industryType')?.valueChanges.subscribe(selectedIndustryId => {
      this.onIndustryTypeChange(selectedIndustryId);
    });
  }

  setupUsernameCheck(): void {
    const usernameControl = this.employeeForm.get('username') as FormControl;

    usernameControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.usernameSubject.next(value);
        this.checkUniqueUsername(value);
      });
  }

  setupCompanyNameCheck(): void {
    const companyNameControl = this.employeeForm.get('companyName') as FormControl;

    companyNameControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.companyNameSubject.next(value);
        this.checkUniqueCompanyName(value);
      });
  }

  private checkUniqueUsername(username: string): void {
    this.checkNamesService.checkUniqueUserName(username).subscribe({
      next: (response) => {
        this.usernameExistsMessage = response.isUnique ? '' : 'Username already exists';
      },
      error: (error) => {
        console.error('Error checking username:', error);
        this.usernameExistsMessage = 'Error checking username';
      }
    });
  }

  private checkUniqueCompanyName(companyName: string): void {
    this.checkNamesService.checkUniqueCompanyName(companyName).subscribe({
      next: (response) => {
        this.companyNameExistsMessage = response.isUnique ? '' : 'Company name already exists';
      },
      error: (error) => {
        console.error('Error checking company name:', error);
        this.companyNameExistsMessage = 'Error checking company name';
      }
    });
  }

  // Fetch all industries
  fetchIndustries(): void {
    this.checkNamesService.getAllIndustryIds().pipe(
      map((response: any) => {
        if (response.error === '0') {
          return response.industryIds.map((industry: any) => ({
            IndustryId: industry.industryId,
            IndustryName: industry.industryName
          }));
        } else {
          throw new Error('Failed to fetch industries due to error in response');
        }
      })
    ).subscribe({
      next: (industries: IndustryType[]) => {
        this.industries.next(industries); // Push all industries to the dropdown initially
      },
      error: (err) => console.error('Error fetching industry data', err)
    });
  }

   //Industry
  
   private fetchIndustryTypes(industryId: number = 0): void {
    this.checkNamesService.fetchIndustryTypes(industryId).subscribe({
      next: (response: any) => {
        if (response.error === "0") {
          const industryData = response.industryType || []; 
  
          if (Array.isArray(industryData) && industryData.length > 0) {
            this.industryTypes = industryData.map((item: any) => ({
              IndustryValue: item.industryValue,
              IndustryName: item.industryName
            }));
            this.filteredIndustryTypes = [...this.industryTypes];
            
          } else {
            console.error('No industry types found in the response.');
            this.industryTypes = []; // Clear industryTypes if no valid data found
          }
        } else {
          console.error('Unexpected error response:', response.error);
          this.industryTypes = []; // Clear industryTypes on error
        }
      },
      error: (error: any) => {
        console.error('Error fetching industry types:', error);
        this.industryTypes = []; // Clear industryTypes on fetch error
      }
    });
  }

  // Trigger filtering of industries based on dropdown selection
  onIndustryTypeChange(selectedIndustryId: string | number): void {
    const parsedIndustryId = parseInt(selectedIndustryId as string, 10); // Ensure it is a number
    if (!isNaN(parsedIndustryId)) {
      this.fetchIndustryTypes(parsedIndustryId); // Fetch based on selected IndustryId
    } else {
      // If no valid IndustryId, show all industry types
      this.filteredIndustryTypes = [...this.industryTypes];
    }
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query: string) => {
        this.filterIndustryTypes(query);
      });
  }

  getTypes(): IndustryTypeResponseDTO[] {
    return this.filteredIndustryTypes;
  }

  filterIndustryTypes(query: string): void {
    if (!query) {
      this.filteredIndustryTypes = [...this.industryTypes]; // Show all if no query
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredIndustryTypes = this.industryTypes.filter(type =>
        type.IndustryName.toLowerCase().includes(lowerQuery)
      );
    }
  }

  onCategoryChange(event: any): void {
    this.onIndustryTypeChange(event.target.value); // Trigger filtering on category change
  }

  onContinue(): void {
    if (this.employeeForm.valid) {
      console.log('Form submitted successfully!', this.employeeForm.value);
    } else {
      this.employeeForm.markAllAsTouched();
      console.log('Form is invalid, please fill in all required fields.');
    }
  }
}


// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';
// import { LocationResponseDTO } from '../../Models/company';
// import { CheckNamesService } from '../../Services/check-names.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-create-account-page',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './create-account-page.component.html',
//   styleUrls: ['./create-account-page.component.scss']
// })
// export class CreateAccountPageComponent implements OnInit {

//   accountForm!: FormGroup; 
//   countries: LocationResponseDTO[] = [];
//   districts: LocationResponseDTO[] = [];
//   thanas: LocationResponseDTO[] = [];
//   outsideBd: boolean = false;  

//   constructor(private fb: FormBuilder, private checkNamesService: CheckNamesService) {
   
//     this.accountForm = this.fb.group({
//       country: ['118'],  
//       district: [''],
//       thana: [''],
//       cityName: [''],  
//       companyAddress: [''],
//       companyAddressBangla: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.fetchCountries(); 

//     // Listen to changes in the country dropdown
//     this.accountForm.get('country')?.valueChanges.subscribe((value: string) => {
//       if (value === '118') {
//         this.outsideBd = false;  
//         this.fetchDistricts();    
//       } else {
//         this.outsideBd = true;    
//       }
//     });

//     // Listen to district selection to fetch related thanas
//     this.accountForm.get('district')?.valueChanges.subscribe(districtId => {
//       if (districtId) {
//         this.fetchThanas(districtId);
//       }
//     });
//   }

//   // Fetch countries (Outside Bangladesh included)
//   private fetchCountries(): void {
//     const requestPayload = { OutsideBd: '1', DistrictId: '' };

//     this.checkNamesService.getLocations(requestPayload).subscribe({
//       next: (response: any) => {
//         console.log("Full response:", response);

//         if (response?.error === '0') {  
//           const countryData = response.bdDistrict || [];

//           if (Array.isArray(countryData) && countryData.length > 0) {
//             this.countries = countryData.map((item: any) => ({
//               OptionValue: item.optionValue,  
//               OptionText: item.optionText,
//             }));
//             this.accountForm.get('country')?.setValue('118');
//           } else {
//             console.error('No countries found in the response.');
//             this.countries = [];  
//           }
//         } else {
//           console.error('Unexpected error response:', response?.error);
//           this.countries = []; 
//         }
//       },
//       error: (error: any) => {
//         console.error('Error fetching countries:', error);
//         this.countries = []; 
//       }
//     });
//   }

//   // Fetch districts within Bangladesh
//   private fetchDistricts(): void {
//     const requestPayload = { OutsideBd: '0', DistrictId: '' };

//     this.checkNamesService.getLocations(requestPayload).subscribe({
//       next: (response: any) => {
//         if (response?.error === "0") {
//           const districtData = response.bdDistrict || [];
//           this.districts = districtData.map((item: any) => ({
//             OptionValue: item.optionValue,
//             OptionText: item.optionText,
//           }));
//           this.thanas = []; 
//         } else {
//           this.districts = [];
//         }
//       },
//       error: () => {
//         this.districts = [];
//       }
//     });
//   }

//   // Fetch thanas for the selected district
//   private fetchThanas(districtId: string): void {
//     const requestPayload = { OutsideBd: '0', DistrictId: districtId };

//     this.checkNamesService.getLocations(requestPayload).subscribe({
//       next: (response: any) => {
//         if (response?.error === "0") {
//           const thanaData = response.bdDistrict || [];
//           this.thanas = thanaData.map((item: any) => ({
//             OptionValue: item.optionValue,
//             OptionText: item.optionText,
//           }));
//         } else {
//           this.thanas = [];
//         }
//       },
//       error: () => {
//         this.thanas = [];
//       }
//     });
//   }
//   onCountryChange() {
//     const selectedCountry = this.accountForm.get('country')?.value;
//     this.outsideBd = selectedCountry !== '118';
//     if (this.outsideBd) {
//       this.accountForm.get('district')?.setValue('');
//       this.accountForm.get('thana')?.setValue('');
//     }
//   }
// }  
