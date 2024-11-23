import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CheckNamesService } from '../../Services/check-names.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { SelectFieldComponent } from '../../components/select-field/select-field.component';
import { TextAreaComponent } from '../../components/text-area/text-area.component';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';
import {  CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { IndustryTypeResponseDTO, IndustryType, LocationResponseDTO, RLNoRequestModel, CompanyNameCheckRequestDTO } from '../../Models/company';
import { ErrorModalComponent } from "../../components/error-modal/error-modal.component";
import { RadioGroupComponent } from '../../components/radio-group/radio-group.component';
import { PricingPolicyComponent } from '../../components/pricing-policy/pricing-policy.component';
import { MathCaptchaComponent } from '../../components/math-captcha/math-captcha.component';
import { filePath,countrie ,disabilities} from '../../constants/file-path.constants';
import { AddIndustryModalComponent } from "../../components/add-industry-modal/add-industry-modal.component";

@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [
    MathCaptchaComponent,
    PricingPolicyComponent,
    RadioGroupComponent,
    InputFieldComponent,
    SelectFieldComponent,
    TextAreaComponent,
    CheckboxGroupComponent,
    ReactiveFormsModule,
    CommonModule,
    ErrorModalComponent,
    MathCaptchaComponent,
    AddIndustryModalComponent
],
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent implements OnInit {
  filePath = filePath;
  countrie = countrie;
  disabilities = disabilities;


  @ViewChild(MathCaptchaComponent) captchaComponent!: MathCaptchaComponent;
  isCaptchaValid = false;

  selectedCountry: LocationResponseDTO | null = null;
  searchTerm = new FormControl('');
  isOpen: boolean = false;
  showAddIndustryButton: boolean = false; 
  


  fieldsOrder: string[] = [];
  industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  industryTypes: IndustryTypeResponseDTO[] = [];
  filteredIndustryTypes: IndustryTypeResponseDTO[] = [];

  countries: LocationResponseDTO[] = [];
  districts: LocationResponseDTO[] = [];
  thanas: LocationResponseDTO[] = [];
  outsideBd: boolean = false;  
  selectedIndustries: { IndustryValue: number; IndustryName: string }[] = [];

currentCountry = { name: 'Bangladesh', code: 'BD', phoneCode: '+880' }; 
currentFlagPath = this.filePath['Bangladesh'];
filteredCountriesList = this.countrie;

  facilitiesForDisabilitiesControl = new FormControl(false);
  isPolicyAcceptedControl = new FormControl(false);
  isPolicyAccepted: boolean = this.isPolicyAcceptedControl.value!;


  employeeForm: FormGroup = new FormGroup({
    //new
    facilitiesForDisabilities: this.facilitiesForDisabilitiesControl,
    isPolicyAccepted: this.isPolicyAcceptedControl,
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    companyNameBangla: new FormControl(''),
    yearsOfEstablishMent: new FormControl('', Validators.required),
    companySize: new FormControl('-1', Validators.required),
    outSideCity: new FormControl(''),
    businessDesc: new FormControl(''),
    tradeNo: new FormControl(''),
    webUrl: new FormControl(''),
    contactName: new FormControl('', [Validators.required]),
    contactDesignation: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
    contactMobile: new FormControl(''),
    inclusionPolicy: new FormControl(''),
    support: new FormControl(''),
    disabilityWrap: new FormControl(''),
    training: new FormControl(''),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    companyName: new FormControl('', [Validators.required]),
    industryType: new FormControl(''),
    country: new FormControl('118'),  
    district: new FormControl(''),
    thana: new FormControl(''),
    cityName: new FormControl(''),
    companyAddress: new FormControl(''),
    companyAddressBangla: new FormControl(''),
    rlNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
  });
  // Signals for form control values
  usernameControl = computed(() => this.employeeForm.get('username') as FormControl<string>);
  companyNameControl = computed(() => this.employeeForm.get('companyName') as FormControl<string>);
  industryTypeControl = computed(() => this.employeeForm.get('industryType') as FormControl<string>);
  countryControl = computed(() => this.employeeForm.get('country') as FormControl<string>);
  districtControl = computed(() => this.employeeForm.get('district') as FormControl<string>);
  thanaControl = computed(() => this.employeeForm.get('thana') as FormControl<string>);
  rlNoControl = computed(() => this.employeeForm.get('rlno') as FormControl<string>);
  formControlSignals = computed(() => {
    const signals: { [key: string]: FormControl<any> } = {};
    Object.keys(this.employeeForm.controls).forEach(key => {
      signals[key] = this.employeeForm.get(key) as FormControl<any>;
    });
    return signals;
  });
  usernameExistsMessage: string = '';
  companyNameExistsMessage: string = '';
  isUniqueCompanyName: boolean = false;
  rlErrorMessage: string = '';
  showError: boolean = false;
  showErrorModal: boolean = false; 
  showAll: boolean = false;  
  showAddIndustryModal = false;
  selectedIndustryId: number = 0;

  searchControl: FormControl = new FormControl(''); 

  private usernameSubject: Subject<string> = new Subject();
  private companyNameSubject: Subject<string> = new Subject();

  constructor(private checkNamesService: CheckNamesService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
    .pipe(debounceTime(300)) // Add debounce to reduce calls
    .subscribe(() => {
      this.filteredCountriesList = this.filteredCountrie();
    });

    this.setupUsernameCheck();
    this.setupCompanyNameCheck();
    this.fetchIndustries();
    this.setupSearch();
    this.fetchIndustryTypes();
    this.fetchCountries();
    this.updateFlagPath();
    this.searchTerm.valueChanges.subscribe(() => this.filterCountries());
    this.selectedCountry = {
      OptionText: 'Bangladesh',
      OptionValue: '118',
      flagPath: this.filePath['Bangladesh']
    };
    this.currentCountry = { name: 'Bangladesh', code: 'BD', phoneCode: '+880' };
    this.currentFlagPath = this.filePath['Bangladesh'];
    this.employeeForm.get('industryType')?.valueChanges.subscribe(selectedIndustryId => {
      this.onIndustryTypeChange(selectedIndustryId);
      this.selectedIndustryId = selectedIndustryId;
      console.log('Parent Component - Selected Industry ID:', selectedIndustryId);


    });
    this.employeeForm.get('country')?.valueChanges.subscribe((value: string) => {
            if (value === '118') {
              this.outsideBd = false;  
              this.fetchDistricts();    
            } else {
              this.outsideBd = true;    
            }
          });
    this.employeeForm.get('district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.fetchThanas(districtId);
      }
    });
  }
  filterCountries(): LocationResponseDTO[] {
    return this.countries.filter(country => 
      country.OptionText.toLowerCase().includes(this.searchTerm.value?.toLowerCase() || '')
    );
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

  filteredCountrie() {
    const query = this.searchControl.value?.toLowerCase() || '';
    return this.countrie.filter(country =>
      country.name.toLowerCase().includes(query)
    );
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
        console.log('API Response:', response); 
        this.usernameExistsMessage = response.message == 'Success!' ? '' : 'Username already exists';
      },
      error: (error) => {
        console.error('Error checking username:', error);
        this.usernameExistsMessage = 'This Username already exists. Try another.';
      }
    });
  }
  
  // Check for unique company name 
  private checkUniqueCompanyName(companyName: string): void {
    this.checkNamesService.checkUniqueCompanyName(companyName).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.message == 'Success!') {
          this.isUniqueCompanyName = true;
          this.companyNameExistsMessage = '';
        }
        else{
          this.isUniqueCompanyName = false;
          this.companyNameExistsMessage = 'Company name already exists';
        }
      },
      error: (error) => {
        console.error('Error checking company name:', error);
        this.companyNameExistsMessage = 'Error checking company name';
      }
    });
  }
  // rl
  onRLNoBlur(): void {
    this.employeeForm.controls['rlNo'].markAsTouched();
  
    if (this.employeeForm.controls['rlNo'].valid) {
      this.verifyRLNo();  
    } else {
      this.showError = true;
      this.rlErrorMessage = 'RL Number is required';
      this.showErrorModal = true; 
    }
  }
  verifyRLNo(): void {
    const rlNo: string = this.employeeForm.get('rlNo')?.value.toString();
    const companyName: string = this.employeeForm.get('companyName')?.value.toString(); 
    if (rlNo) {
      const rlRequest: RLNoRequestModel = { RLNo: rlNo };

      const companyRequest: CompanyNameCheckRequestDTO = {
        UserName: '', 
        CheckFor: 'c',
        CompanyName: companyName
      };

      console.log(companyRequest.CompanyName)

      this.checkNamesService.verifyRLNo(rlRequest).subscribe({
        next: (response: any) => {
          console.log('RL No Response:', response); 
          if (response.error === '0' && response.company_Name === companyRequest.CompanyName) {
            this.showError = false;
            this.rlErrorMessage = '';
            this.showErrorModal = false; 
          } else {
            this.showError = true;
            this.showErrorModal = true; 
          }
        },
        error: () => {
          this.showError = true;
          this.showErrorModal = true; 
        }
      });
          } else {
            this.showError = true;
            this.showErrorModal = true; 
          }
  }
  closeModal(): void {
    this.showErrorModal = false; 
  }
  // Fetch all industries
  fetchIndustries(): void {
    this.checkNamesService.getAllIndustryIds().pipe(
      map((response: any) => {
        if (response.error === '0') {
          const industries = response.industryIds.map((industry: any) => ({
            IndustryId: industry.industryId,
            IndustryName: industry.industryName
          }));
          
          industries.push({ IndustryId: -10, IndustryName: 'Others' }); 
          return industries;
        } else {
          throw new Error('Failed to fetch industries due to error in response');
        }
      })
    ).subscribe({
      next: (industries: IndustryType[]) => {
        this.industries.next(industries); 
      },
      error: (err) => console.error('Error fetching industry data', err)
    });
  }

   // Fetch industry types based on selected IndustryId
private fetchIndustryTypes(industryId: number = -1 ): void {
  this.showAddIndustryButton = false;

  if (industryId === -1) {
    console.log('Default "All" selected; hiding the button.');
    return; 
  }
  this.checkNamesService.fetchIndustryTypes(industryId).subscribe({
    next: (response: any) => {
      if (response.error === '0') {
        const industryData = response.industryType || []; 
  
        if (Array.isArray(industryData) && industryData.length > 0) {
          this.industryTypes = industryData.map((item: any) => ({
            IndustryValue: item.industryValue,
            IndustryName: item.industryName
          }));
          this.filteredIndustryTypes = [...this.industryTypes];
          // this.showAddIndustryButton = industryId === -10;
          this.showAddIndustryButton = true;

        } else {
          console.warn(
            `No industry types found for IndustryId: ${industryId}.`
          );
          this.industryTypes = []; 
          this.showAddIndustryButton = false;
        }
      } else {
        console.error('Unexpected error response:', response.error);
        this.industryTypes = []; 
        this.showAddIndustryButton = false;
      }
    },
    error: (error: any) => {
      console.error('Error fetching industry types:', error);
      this.industryTypes = []; 
      this.showAddIndustryButton = false;
    }
  });
}


addNewIndustry(): void {
  this.showAddIndustryModal = true;
}

// Close the modal
closeAddIndustryModal(): void {
  this.showAddIndustryModal = false;
}

// Handle the newly added industry
handleNewIndustry(industry: IndustryType): void {
  const updatedIndustries = [...this.industries.value, industry];
  this.industries.next(updatedIndustries);
  this.closeAddIndustryModal(); 
}

  // Trigger filtering of industries based on dropdown selection
  onIndustryTypeChange(selectedIndustryId: string | number): void {
    const parsedIndustryId = parseInt(selectedIndustryId as string, 10); 
    if (!isNaN(parsedIndustryId)) {
      this.fetchIndustryTypes(parsedIndustryId); 
    } else {
      this.filteredIndustryTypes = [...this.industryTypes];
    }
  }
 
  onIndustryCheckboxChange(
    event: Event,
    item: { IndustryValue: number; IndustryName: string }
  ): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedIndustries.push(item);
    } else {
      this.selectedIndustries = this.selectedIndustries.filter(
        (industry) => industry.IndustryValue !== item.IndustryValue
      );
    }
  }

  removeIndustry(industry: { IndustryValue: number; IndustryName: string }): void {
    this.selectedIndustries = this.selectedIndustries.filter(
      (selected) => selected.IndustryValue !== industry.IndustryValue
    );

    // Uncheck the corresponding checkbox
    const checkbox = document.getElementById(
      `industry_type_${industry.IndustryValue}`
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }


  // Fetch countries (Outside Bangladesh included)
  private fetchCountries(): void {
    const requestPayload = { OutsideBd: '1', DistrictId: '' };
    this.checkNamesService.getLocations(requestPayload).subscribe({
      next: (response: any) => {
        console.log("Full response:", response);

        if (response?.error === '0') {  
          const countryData = response.bdDistrict || [];

          if (Array.isArray(countryData) && countryData.length > 0) {
            this.countries = countryData.map((item: any) => ({
              OptionValue: item.optionValue,  
              OptionText: item.optionText,
              flagPath: this.filePath[item.optionText] || '' 

            }));
            this.employeeForm.get('country')?.setValue('118');
          } else {
            console.error('No countries found in the response.');
            this.countries = [];  
          }
        } else {
          console.error('Unexpected error response:', response?.error);
          this.countries = []; 
        }
      },
      error: (error: any) => {
        console.error('Error fetching countries:', error);
        this.countries = []; 
      }
    });
  }

// Fetch districts within Bangladesh
  private fetchDistricts(): void {
    const requestPayload = { OutsideBd: '0', DistrictId: '' };

    this.checkNamesService.getLocations(requestPayload).subscribe({
      next: (response: any) => {
        if (response?.error === "0") {
          const districtData = response.bdDistrict || [];
          this.districts = districtData.map((item: any) => ({
            OptionValue: item.optionValue,
            OptionText: item.optionText,
          }));
          this.thanas = []; 
        } else {
          this.districts = [];
        }
      },
      error: () => {
        this.districts = [];
      }
    });
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectCountry(country: LocationResponseDTO) {
    this.selectedCountry = country;
    this.isOpen = false;
    this.searchTerm.setValue('');
  }

  get filteredCountries() {
    return this.filterCountries();
  }

 public getFlagSvg(country: LocationResponseDTO): string {
    const filePath = country.flagPath;
      `<img src="${filePath}" alt="flag" width="24" height="24" />`
    return filePath;
  
  }
// Fetch thanas for the selected district
  private fetchThanas(districtId: string): void {
    const requestPayload = { OutsideBd: '0', DistrictId: districtId };

    this.checkNamesService.getLocations(requestPayload).subscribe({
      next: (response: any) => {
        if (response?.error === "0") {
          const thanaData = response.bdDistrict || [];
          this.thanas = thanaData.map((item: any) => ({
            OptionValue: item.optionValue,
            OptionText: item.optionText,
          }));
        } else {
          this.thanas = [];
        }
      },
      error: () => {
        this.thanas = [];
      }
    });
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
      this.filteredIndustryTypes = [...this.industryTypes]; 
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredIndustryTypes = this.industryTypes.filter(type =>
        type.IndustryName.toLowerCase().includes(lowerQuery)
      );
    }
  }
  onCategoryChange(event: Event): void {
    const selectedIndustryId = parseInt((event.target as HTMLSelectElement).value);
    this.fetchIndustryTypes(selectedIndustryId);
    this.onIndustryTypeChange(selectedIndustryId);
    this.showAddIndustryButton = false;
  }
  
 
  chooseCountry(country: any) {
    this.currentCountry = country;
    this.currentFlagPath = this.filePath[country.name];
    this.isOpen = false; 
  }

  private updateFlagPath() {
   const countryCode = this.employeeForm.controls['contactMobile'].value;
    const country = this.countrie.find(c => c.code === countryCode);
    this.currentFlagPath = country ? this.filePath[country.name] : '';
  }

formValue : any
currentValidationFieldIndex: number = 0;
isContinueClicked: boolean = false;

onInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
}
toggleShowAll() {
  this.showAll = !this.showAll;
}
checkCaptchaValidity() {
  this.isCaptchaValid = this.captchaComponent.isCaptchaValid();
}
onContinue() {
  this.checkCaptchaValidity();
  this.isContinueClicked = true; 
  console.log(this.employeeForm.value);


  const fieldsOrder = [
    'username', 
    'password',
    'confirmPassword',
    'companyName',
    'yearsOfEstablishMent',
    'companySize',
    'companyAddress',
    'companyAddressBangla',
    'contactName',
    'contactDesignation',
    'contactEmail'
  ];

  const currentField = fieldsOrder[this.currentValidationFieldIndex];
  const control = this.employeeForm.get(currentField);

  if (this.employeeForm.valid) {
    this.isPolicyAcceptedControl.setValue(true);
    this.formValue = this.employeeForm.value;
    console.log("Form submitted successfully!", this.formValue);
  } else if (control && control.invalid) {
    control.markAsTouched();

    const errors = control.errors;
    console.log(`Field ${currentField} is invalid:`, errors);

    return;

  } else {
    this.currentValidationFieldIndex++;

    if (this.currentValidationFieldIndex < fieldsOrder.length) {
      const nextField = fieldsOrder[this.currentValidationFieldIndex];
      this.employeeForm.get(nextField)?.markAsTouched();
    } else {
      this.isPolicyAcceptedControl.setValue(true);
      this.formValue = this.employeeForm.value;
      console.log("Form submitted successfully after validating all fields!", this.formValue);
    }
  }
}
}