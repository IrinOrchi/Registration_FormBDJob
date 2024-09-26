import { Component, computed } from '@angular/core';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { SelectFieldComponent } from '../../components/select-field/select-field.component';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TextAreaComponent } from '../../components/text-area/text-area.component';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';
import { JsonPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-create-account-page',
  standalone: true,
  imports: [
    InputFieldComponent,
    SelectFieldComponent,
    FormsModule,
    TextAreaComponent,
    CheckboxGroupComponent,
    NgClass,
    ReactiveFormsModule,
    JsonPipe
    
  ],
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  handleIndustryAdded(industry: any) {
    console.log('New Industry Added:', industry);
    // Add logic to handle the new industry
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectedCountry = '1';
  isBangladeshSelected = true;

  facilitiesForDisabilitiesControl = new FormControl(false);

  isPolicyAcceptedControl = new FormControl(false);



  countryControl = new FormControl('1');

  isPolicyAccepted: boolean = this.isPolicyAcceptedControl.value!;


  disabilities = [
    { label: 'Accessible documentation and alternative formats', value: '1' },
    { label: 'Accessible Washrooms / Toilets', value: '2' },
    { label: 'Adapted Transport facility for Distant Travelling', value: '3' },
    { label: 'Assistive Software, communication and computer devices', value: '4' },
    { label: 'Available Flexible working shifts', value: '5' },
    { label: 'Offering Work from home', value: '6' },
    { label: 'Ramps or Lifts or Escalators for entry and move between floors', value: '7' },
    { label: 'Reasonable Accommodation in Recruitment/interview procedures like sign language, oral/typed/video interview', value: '8' },
    { label: 'Warning Indicators or Markers in place for hazards, staircase', value: '9' },
    { label: 'Workstation or seating adaptations for easy use', value: '10' }
  ];

  employeeForm: FormGroup = new FormGroup<any>({
    countryCo: this.countryControl,
    facilitiesForDisabilities: this.facilitiesForDisabilitiesControl,
    isPolicyAccepted: this.isPolicyAcceptedControl,
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    companyName: new FormControl('', [Validators.required]),
    companyNameBangla: new FormControl(''),
    yearsOfEstablishMent: new FormControl('', Validators.required),
    companySize: new FormControl('-1', Validators.required),
    country: new FormControl('1'),
    district: new FormControl('-1'),
    thana: new FormControl('-1'),
    outSideCity: new FormControl(''),
    companyAddress: new FormControl('', Validators.required),
    companyAddressBangla: new FormControl('', Validators.required),
    industryCategory: new FormControl('', Validators.required),
    industryWrapCategory: new FormControl('', Validators.required),
    businessDesc: new FormControl(''),
    tradeNo: new FormControl(''),
    rlNo: new FormControl(''),
    webUrl: new FormControl(''),
    contactName: new FormControl('', [Validators.required]),
    contactDesignation: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
    contactMobile: new FormControl(''),
    inclusionPolicy: new FormControl(''),
    support: new FormControl(''),
    disabilityWrap: new FormControl(''),
    disabilities: new FormControl(''),
  });

  ngOnInit(): void {
    // Listen for changes in the country selection
    this.employeeForm.controls['countryCo'].valueChanges.subscribe((selectedValue) => {
      this.isBangladeshSelected = selectedValue === '1';  // Update Bangladesh selection logic
    });
  }

  countryCoSignal = computed(()=> this.employeeForm.get('countryCo') as FormControl<string>)

  // searchQueryControl = computed(() => this.employeeForm.get('searchQuery') as FormControl<string>);

  // Create an object containing all form control signals dynamically
  formControlSignals = computed(() => {
    const signals: { [key: string]: FormControl<any> } = {};
    Object.keys(this.employeeForm.controls).forEach(key => {
      signals[key] = this.employeeForm.get(key) as FormControl<any>;
    });
    return signals;
  });



  formValue: any;
  
  onContinue() {
    // Check if the form is valid before proceeding
    this.formValue = this.employeeForm.value;
  }
  
  
  selectedCategory: string = '';
  searchQuery: string = '';

  types = [
    { label: 'Dairy', value: 'Agriculture' },
{ label: 'College', value: 'Education' },
{ label: 'ISP', value: 'Telecom' },
{ label: 'Law Firm', value: 'Legal' },
{ label: 'School', value: 'Education' },
{ label: 'Software Company', value: 'IT' },
{ label: 'Telecom', value: 'Telecom' },
{ label: 'Buying House', value: 'Manufacturing' },
{ label: 'Dyeing Factory', value: 'Manufacturing' },
{ label: 'Garments', value: 'Manufacturing' },
{ label: 'Healthcare', value: 'Healthcare' },
{ label: 'Hospital', value: 'Healthcare' },
{ label: 'Insurance', value: 'Finance' },
{ label: 'Garments Accessories', value: 'Manufacturing' },
{ label: 'Marketing', value: 'Media' },
{ label: 'Education', value: 'Education' },
{ label: 'Electronics', value: 'Manufacturing' },
{ label: 'Furniture', value: 'Retail' },
{ label: 'Transportation', value: 'Logistics' },
{ label: 'Clearing and Forwarding (C and F) Companies', value: 'Logistics' },
{ label: 'E-commerce Startup', value: 'Retail' },
{ label: 'Club', value: 'Hospitality' },
{ label: 'Convention center', value: 'Hospitality' },
{ label: 'Estate Agency', value: 'RealEstate' },
{ label: 'Event Planner', value: 'Media' },
{ label: 'Fashion', value: 'Manufacturing' },
{ label: 'Food and Beverage', value: 'Hospitality' },
{ label: 'Government', value: 'Legal' },
{ label: 'Car Dealership', value: 'Automotive' },
{ label: 'Auto Repair Shop', value: 'Automotive' },
{ label: 'Vehicle Manufacturing', value: 'Automotive' },
{ label: 'Construction Company', value: 'Construction' },
{ label: 'Real Estate Developer', value: 'Construction' },
{ label: 'Architectural Firm', value: 'Construction' },
{ label: 'Travel Agency', value: 'Tourism' },
{ label: 'Hotel and Resort', value: 'Tourism' },
{ label: 'Tour Operator', value: 'Tourism' },
{ label: 'Solar Power Plant', value: 'Energy' },
{ label: 'Oil and Gas Company', value: 'Energy' },
{ label: 'Wind Farm', value: 'Energy' },
{ label: 'Dairy Farm', value: 'Agriculture' },
{ label: 'Crop Farming', value: 'Agriculture' },
{ label: 'Agricultural Equipment Supplier', value: 'Agriculture' }

    
  ];

  getTypes() {
    let filteredTypes = this.selectedCategory === 'Others' || this.selectedCategory === ''
      ? this.types
      : this.types.filter(type => type.value === this.selectedCategory);

    if (this.searchQuery) {
      filteredTypes = filteredTypes.filter(type => 
        type.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filteredTypes;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.searchQuery = ''; 
  }
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.subscribe(query => {
      this.onSearchQueryChange(query || ''); // Default null to an empty string
    });
  }

  onSearchQueryChange(query: string) {
    console.log('Search query changed:', query);
    this.searchQuery = query;
  }
  
  
  

}
