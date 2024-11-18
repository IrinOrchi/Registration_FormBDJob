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
    MathCaptchaComponent
],
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent implements OnInit {
  

  @ViewChild(MathCaptchaComponent) captchaComponent!: MathCaptchaComponent;
  isCaptchaValid = false;

  selectedCountry: LocationResponseDTO | null = null;
  searchTerm = new FormControl('');
  isOpen: boolean = false;

  //new
  fieldsOrder: string[] = [];

  industries: BehaviorSubject<IndustryType[]> = new BehaviorSubject<IndustryType[]>([]);
  industryTypes: IndustryTypeResponseDTO[] = [];
  filteredIndustryTypes: IndustryTypeResponseDTO[] = [];

  countries: LocationResponseDTO[] = [];
  districts: LocationResponseDTO[] = [];
  thanas: LocationResponseDTO[] = [];
  outsideBd: boolean = false;  
  selectedIndustries: { IndustryValue: number; IndustryName: string }[] = [];


   filePath: { [key: string]: string } = {

    "Afghanistan": "assets/images/Flags/Afghanistan (AF).svg",
    "Albania": "assets/images/Flags/Albania (AL).svg",
    "Algeria": "assets/images/Flags/Algeria (DZ).svg",
    "American Samoa": "assets/images/Flags/American Samoa (AS).svg",
    "Andorra": "assets/images/Flags/Andorra (AD).svg",
    "Angola": "assets/images/Flags/Angola (AO).svg",
    "Anguilla": "assets/images/Flags/Anguilla (AI).svg",
    "Antarctica": "assets/images/Flags/Antarctica (AQ).svg",
    "Antigua": "assets/images/Flags/Antigua and Barbuda (AG).svg",
    "Argentina": "assets/images/Flags/Argentina (AR).svg",
    "Armenia": "assets/images/Flags/Armenia (AM).svg",
    "Aruba": "assets/images/Flags/Aruba (AW).svg",
    "Australia": "assets/images/Flags/Australia (AU).svg",
    "Austria": "assets/images/Flags/Austria (AT).svg",
    "Azerbaijan": "assets/images/Flags/Azerbaijan (AZ).svg",
    "Bahamas": "assets/images/Flags/Bahamas (BS).svg",
    "Bahrain": "assets/images/Flags/Bahrain (BH).svg",
    "Bangladesh": "assets/images/Flags/Bangladesh (BD).svg",
    "Barbados": "assets/images/Flags/Barbados (BB).svg",
    "Belarus": "assets/images/Flags/Belarus (BY).svg",
    "Belgium": "assets/images/Flags/Belgium (BE).svg",
    "Belize": "assets/images/Flags/Belize (BZ).svg",
    "Benin": "assets/images/Flags/Benin (BJ).svg",
    "Bermuda": "assets/images/Flags/Bermuda (BM).svg",
    "British Virgin Islands" : "assets/images/Flags/Virgin Islands (British) (VG).svg",
    "Bhutan": "assets/images/Flags/Bhutan (BT).svg",
    "Bolivia": "assets/images/Flags/Bolivia (BO).svg",
    "Bosnia and Herzegovina": "assets/images/Flags/Bosnia and Herzegovina (BA).svg",
    "Botswana": "assets/images/Flags/Botswana (BW).svg",
    "Brazil": "assets/images/Flags/Brazil (BR).svg",
    "British Indian Ocean Territory": "assets/images/Flags/British Indian Ocean Territory (IO).svg",
    "Brunei": "assets/images/Flags/Brunei Darussalam (BN).svg",
    "Bulgaria": "assets/images/Flags/Bulgaria (BG).svg",
    "Burkina Faso": "assets/images/Flags/Burkina Faso (BF).svg",
    "Burundi": "assets/images/Flags/Burundi (BI).svg",
    "Cambodia": "assets/images/Flags/Cambodia (KH).svg",
    "Cameroon": "assets/images/Flags/Cameroon (CM).svg",
    "Canada": "assets/images/Flags/Canada (CA).svg",
    "Central African Republic": "assets/images/Flags/Central African Republic (CF).svg",
    "Chile": "assets/images/Flags/Chile (CL).svg",
    "China": "assets/images/Flags/China (CN).svg",
    "Colombia": "assets/images/Flags/Colombia (CO).svg",
    "Comoros": "assets/images/Flags/Comoros (KM).svg",
    "Congo": "assets/images/Flags/Congo (CG).svg",
    "Congo (Zaire)": "assets/images/Flags/Democratic Republic of the Congo (CD).svg",
    "Cook Islands": "assets/images/Flags/Cook Islands (CK).svg",
    "Costa Rica": "assets/images/Flags/Costa Rica (CR).svg",
    "Cote d'Ivoire (Ivory Coast)": "assets/images/Flags/Côte d'Ivoire (CI).svg",
    "Croatia": "assets/images/Flags/Croatia (HR).svg",
    "Cuba": "assets/images/Flags/Cuba (CU).svg",
    "Cyprus": "assets/images/Flags/Cyprus (CY).svg",
    "Czech Republic": "assets/images/Flags/Czech Republic (CZ).svg",
    "Democratic Republic of the Congo": "assets/images/Flags/Democratic Republic of the Congo (CD).svg",
    "Denmark": "assets/images/Flags/Denmark (DK).svg",
    "Djibouti": "assets/images/Flags/Djibouti (DJ).svg",
    "Dominica": "assets/images/Flags/Dominica (DM).svg",
    "Dominican Republic": "assets/images/Flags/Dominican Republic (DO).svg",
    "Ecuador": "assets/images/Flags/Ecuador (EC).svg",
    "Egypt": "assets/images/Flags/Egypt (EG).svg",
    "El Salvador": "assets/images/Flags/El Salvador (SV).svg",
    "England": "assets/images/Flags/England (GB-ENG).svg",
    "Equatorial Guinea": "assets/images/Flags/Equatorial Guinea (GQ).svg",
    "Eritrea": "assets/images/Flags/Eritrea (ER).svg",
    "Eswatini": "assets/images/Flags/Eswatini (SZ).svg",
    "Ethiopia": "assets/images/Flags/Ethiopia (ET).svg",
    "Falkland Islands": "assets/images/Flags/Falkland Islands (FK).svg",
    "Federated States of Micronesia": "assets/images/Flags/Federated States of Micronesia (FM).svg",
    "Fiji": "assets/images/Flags/Fiji (FJ).svg",
    "Finland": "assets/images/Flags/Finland (FI).svg",
    "France": "assets/images/Flags/France (FR).svg",
    "French Guiana": "assets/images/Flags/French Guiana (GF).svg",
    "French Polynesia": "assets/images/Flags/French Polynesia (PF).svg",
    "Gabon": "assets/images/Flags/Gabon (GA).svg",
    "The Gambia": "assets/images/Flags/Gambia (GM).svg",
    "Georgia": "assets/images/Flags/Georgia (GE).svg",
    "Germany": "assets/images/Flags/Germany (DE).svg",
    "Ghana": "assets/images/Flags/Ghana (GH).svg",
    "Gibraltar": "assets/images/Flags/Gibraltar (GI).svg",
    "Greece": "assets/images/Flags/Greece (GR).svg",
    "Greenland": "assets/images/Flags/Greenland (GL).svg",
    "Grenada": "assets/images/Flags/Grenada (GD).svg",
    "Guadeloupe": "assets/images/Flags/Guadeloupe (GP).svg",
    "Guam": "assets/images/Flags/Guam (GU).svg",
    "Guatemala": "assets/images/Flags/Guatemala (GT).svg",
    "Guinea": "assets/images/Flags/Guinea (GN).svg",
    "Guinea-Bissau": "assets/images/Flags/Guinea-Bissau (GW).svg",
    "Guyana": "assets/images/Flags/Guyana (GY).svg",
    "Haiti": "assets/images/Flags/Haiti (HT).svg",
    "The Holy See": "assets/images/Flags/Holy See (VA).svg",
    "Honduras": "assets/images/Flags/Honduras (HN).svg",
    "Hong Kong": "assets/images/Flags/Hong Kong (HK).svg",
    "Hungary": "assets/images/Flags/Hungary (HU).svg",
    "Iceland": "assets/images/Flags/Iceland (IS).svg",
    "India": "assets/images/Flags/India (IN).svg",
    "Indonesia": "assets/images/Flags/Indonesia (ID).svg",
    "Iran": "assets/images/Flags/Iran (IR).svg",
    "Iraq": "assets/images/Flags/Iraq (IQ).svg",
    "Ireland": "assets/images/Flags/Ireland (IE).svg",
    "Israel": "assets/images/Flags/Israel (IL).svg",
    "Italy": "assets/images/Flags/Italy (IT).svg",
    "Jamaica": "assets/images/Flags/Jamaica (JM).svg",
    "Japan": "assets/images/Flags/Japan (JP).svg",
    "Jersey": "assets/images/Flags/Jersey (JE).svg",
    "Jordan": "assets/images/Flags/Jordan (JO).svg",
    "Kazakhstan": "assets/images/Flags/Kazakhstan (KZ).svg",
    "Kenya": "assets/images/Flags/Kenya (KE).svg",
    "Kiribati": "assets/images/Flags/Kiribati (KI).svg",
    "Kuwait": "assets/images/Flags/Kuwait (KW).svg",
    "Kyrgyzstan": "assets/images/Flags/Kyrgyzstan (KG).svg",
    "Laos": "assets/images/Flags/Laos (LA).svg",
    "Latvia": "assets/images/Flags/Latvia (LV).svg",
    "Lebanon": "assets/images/Flags/Lebanon (LB).svg",
    "Lesotho": "assets/images/Flags/Lesotho (LS).svg",
    "Liberia": "assets/images/Flags/Liberia (LR).svg",
    "Libya": "assets/images/Flags/Libya (LY).svg",
    "Liechtenstein": "assets/images/Flags/Liechtenstein (LI).svg",
    "Lithuania": "assets/images/Flags/Lithuania (LT).svg",
    "Luxembourg": "assets/images/Flags/Luxembourg (LU).svg",
    "Macau": "assets/images/Flags/Macau (MO).svg",
    "Madagascar": "assets/images/Flags/Madagascar (MG).svg",
    "Malawi": "assets/images/Flags/Malawi (MW).svg",
    "Malaysia": "assets/images/Flags/Malaysia (MY).svg",
    "Maldives": "assets/images/Flags/Maldives (MV).svg",
    "Mali": "assets/images/Flags/Mali (ML).svg",
    "Malta": "assets/images/Flags/Malta (MT).svg",
    "Marshall Islands": "assets/images/Flags/Marshall Islands (MH).svg",
    "Martinique": "assets/images/Flags/Martinique (MQ).svg",
    "Mauritania": "assets/images/Flags/Mauritania (MR).svg",
    "Mauritius": "assets/images/Flags/Mauritius (MU).svg",
    "Mayotte": "assets/images/Flags/Mayotte (YT).svg",
    "Mexico": "assets/images/Flags/Mexico (MX).svg",
    "Micronesia": "assets/images/Flags/Micronesia (FM).svg",
    "Moldova": "assets/images/Flags/Moldova (MD).svg",
    "Monaco": "assets/images/Flags/Monaco (MC).svg",
    "Mongolia": "assets/images/Flags/Mongolia (MN).svg",
    "Montenegro": "assets/images/Flags/Montenegro (ME).svg",
    "Montserrat": "assets/images/Flags/Montserrat (MS).svg",
    "Morocco": "assets/images/Flags/Morocco (MA).svg",
    "Mozambique": "assets/images/Flags/Mozambique (MZ).svg",
    "Myanmar": "assets/images/Flags/Myanmar (MM).svg",
    "Namibia": "assets/images/Flags/Namibia (NA).svg",
    "Nauru": "assets/images/Flags/Nauru (NR).svg",
    "Nepal": "assets/images/Flags/Nepal (NP).svg",
    "Netherlands": "assets/images/Flags/Netherlands (NL).svg",
    "New Zealand": "assets/images/Flags/New Zealand (NZ).svg",
    "Nicaragua": "assets/images/Flags/Nicaragua (NI).svg",
    "Niger": "assets/images/Flags/Niger (NE).svg",
    "Nigeria": "assets/images/Flags/Nigeria (NG).svg",
    "Niue": "assets/images/Flags/Niue (NU).svg",
    "Norfolk Island": "assets/images/Flags/Norfolk Island (NF).svg",
    "North Macedonia": "assets/images/Flags/North Macedonia (MK).svg",
    "Macedonia": "assets/images/Flags/Macedonia (MK).svg",
    "Northern Mariana Islands": "assets/images/Flags/Northern Mariana Islands (MP).svg",
    "Norway": "assets/images/Flags/Norway (NO).svg",
    "Oman": "assets/images/Flags/Oman (OM).svg",
    "Pakistan": "assets/images/Flags/Pakistan (PK).svg",
    "Palau": "assets/images/Flags/Palau (PW).svg",
    "Panama": "assets/images/Flags/Panama (PA).svg",
    "Papua New Guinea": "assets/images/Flags/Papua New Guinea (PG).svg",
    "Paraguay": "assets/images/Flags/Paraguay (PY).svg",
    "Peru": "assets/images/Flags/Peru (PE).svg",
    "North Korea": "assets/images/Flags/North Korea (KP).svg",
    "New Caledonia": "assets/images/Flags/New Caledonia (NC).svg",
    "Philippines": "assets/images/Flags/Philippines (PH).svg",
    "Pitcairn Islands": "assets/images/Flags/Pitcairn (PN).svg",
    "Poland": "assets/images/Flags/Poland (PL).svg",
    "Portugal": "assets/images/Flags/Portugal (PT).svg",
    "Puerto Rico": "assets/images/Flags/Puerto Rico (PR).svg",
    "Qatar": "assets/images/Flags/Qatar (QA).svg",
    "Réunion": "assets/images/Flags/Réunion (RE).svg",
    "Romania": "assets/images/Flags/Romania (RO).svg",
    "Russia": "assets/images/Flags/Russia (RU).svg",
    "Rwanda": "assets/images/Flags/Rwanda (RW).svg",
    "Saint Barthélemy": "assets/images/Flags/Saint Barthélemy (BL).svg",
    "Saint Helena, Ascension and Tristan da Cunha": "assets/images/Flags/Saint Helena, Ascension and Tristan da Cunha (SH).svg",
    "Saint Kitts and Nevis": "assets/images/Flags/Saint Kitts and Nevis (KN).svg",
    "Saint Lucia": "assets/images/Flags/Saint Lucia (LC).svg",
    "Saint Martin": "assets/images/Flags/Saint Martin (MF).svg",
    "Saint Pierre and Miquelon": "assets/images/Flags/Saint Pierre and Miquelon (PM).svg",
    "Saint Vincent and the Grenadines": "assets/images/Flags/Saint Vincent and the Grenadines (VC).svg",
    "Samoa": "assets/images/Flags/Samoa (WS).svg",
    "San Marino": "assets/images/Flags/San Marino (SM).svg",
    "Sao Tome and Principe": "assets/images/Flags/Sao Tome and Principe (ST).svg",
    "Saudi Arabia": "assets/images/Flags/Saudi Arabia (SA).svg",
    "Senegal": "assets/images/Flags/Senegal (SN).svg",
    "Serbia": "assets/images/Flags/Serbia (RS).svg",
    "Seychelles": "assets/images/Flags/Seychelles (SC).svg",
    "Sierra Leone": "assets/images/Flags/Sierra Leone (SL).svg",
    "Singapore": "assets/images/Flags/Singapore (SG).svg",
    "Sint Eustatius": "assets/images/Flags/Sint Eustatius (SX).svg",
    "Sint Maarten": "assets/images/Flags/Sint Maarten (SX).svg",
    "Slovakia": "assets/images/Flags/Slovakia (SK).svg",
    "Slovenia": "assets/images/Flags/Slovenia (SI).svg",
    "Solomon Islands": "assets/images/Flags/Solomon Islands (SB).svg",
    "Somalia": "assets/images/Flags/Somalia (SO).svg",
    "South Africa": "assets/images/Flags/South Africa (ZA).svg",
    "South Korea": "assets/images/Flags/South Korea (KR).svg",
    "South Sudan": "assets/images/Flags/South Sudan (SS).svg",
    "Spain": "assets/images/Flags/Spain (ES).svg",
    "Sri Lanka": "assets/images/Flags/Sri Lanka (LK).svg",
    "Sudan": "assets/images/Flags/Sudan (SD).svg",
    "Suriname": "assets/images/Flags/Suriname (SR).svg",
    "Svalbard": "assets/images/Flags/Svalbard (SJ).svg",
    "Sweden": "assets/images/Flags/Sweden (SE).svg",
    "Switzerland": "assets/images/Flags/Switzerland (CH).svg",
    "Syria": "assets/images/Flags/Syria (SY).svg",
    "Taiwan": "assets/images/Flags/Taiwan (TW).svg",
    "Tajikistan": "assets/images/Flags/Tajikistan (TJ).svg",
    "Tanzania": "assets/images/Flags/Tanzania (TZ).svg",
    "Thailand": "assets/images/Flags/Thailand (TH).svg",
    "Timor-Leste": "assets/images/Flags/Timor-Leste (TL).svg",
    "Togo": "assets/images/Flags/Togo (TG).svg",
    "Tokelau": "assets/images/Flags/Tokelau (TK).svg",
    "Tonga": "assets/images/Flags/Tonga (TO).svg",
    "Trinidad and Tobago": "assets/images/Flags/Trinidad and Tobago (TT).svg",
    "Tunisia": "assets/images/Flags/Tunisia (TN).svg",
    "Turkey": "assets/images/Flags/Turkey (TR).svg",
    "Turkmenistan": "assets/images/Flags/Turkmenistan (TM).svg",
    "Turks and Caicos Islands": "assets/images/Flags/Turks and Caicos Islands (TC).svg",
    "Tuvalu": "assets/images/Flags/Tuvalu (TV).svg",
    "Uganda": "assets/images/Flags/Uganda (UG).svg",
    "Ukraine": "assets/images/Flags/Ukraine (UA).svg",
    "United Arab Emirates": "assets/images/Flags/United Arab Emirates (AE).svg",
    "United Kingdom": "assets/images/Flags/United Kingdom (GB).svg",
    "United States": "assets/images/Flags/United States of America (US).svg",
    "Uruguay": "assets/images/Flags/Uruguay (UY).svg",
    "Uzbekistan": "assets/images/Flags/Uzbekistan (UZ).svg",
    "Vanuatu": "assets/images/Flags/Vanuatu (VU).svg",
    "Vatican City": "assets/images/Flags/Vatican City (VA).svg",
    "Venezuela": "assets/images/Flags/Venezuela (VE).svg",
    "Vietnam": "assets/images/Flags/Vietnam (VN).svg",
    "Western Sahara": "assets/images/Flags/Western Sahara (EH).svg",
    "Yemen": "assets/images/Flags/Yemen (YE).svg",
    "Zambia": "assets/images/Flags/Zambia (ZM).svg",
    "Zimbabwe": "assets/images/Flags/Zimbabwe (ZW).svg"
  
  
};

countrie = [
{ name: 'Afghanistan', code: 'AF', phoneCode: '+93' },
{ name: 'Albania', code: 'AL', phoneCode: '+355' },
{ name: 'Algeria', code: 'DZ', phoneCode: '+213' },
{ name: 'American Samoa', code: 'AS', phoneCode: '+1' },
{ name: 'Anguilla', code: 'AI', phoneCode: '+1' },
{ name: 'Antarctica', code: 'AQ', phoneCode: '+672' },
{ name: 'Antigua and Barbuda', code: 'AG', phoneCode: '+1' },
{ name: 'Argentina', code: 'AR', phoneCode: '+54' },
{ name: 'Armenia', code: 'AM', phoneCode: '+374' },
{ name: 'Aruba', code: 'AW', phoneCode: '+297' },
{ name: 'Australia', code: 'AU', phoneCode: '+61' },
{ name: 'Austria', code: 'AT', phoneCode: '+43' },
{ name: 'Azerbaijan', code: 'AZ', phoneCode: '+994' },
{ name: 'Bahamas', code: 'BS', phoneCode: '+1' },
{ name: 'Bahrain', code: 'BH', phoneCode: '+973' },
{ name: 'Bangladesh', code: 'BD', phoneCode: '+880' },
{ name: 'Barbados', code: 'BB', phoneCode: '+1' },
{ name: 'Belarus', code: 'BY', phoneCode: '+375' },
{ name: 'Belgium', code: 'BE', phoneCode: '+32' },
{ name: 'Belize', code: 'BZ', phoneCode: '+501' },
{ name: 'Benin', code: 'BJ', phoneCode: '+229' },
{ name: 'Bermuda', code: 'BM', phoneCode: '+1' },
{ name: 'Bhutan', code: 'BT', phoneCode: '+975' },
{ name: 'Bolivia', code: 'BO', phoneCode: '+591' },
{ name: 'Bosnia and Herzegovina', code: 'BA', phoneCode: '+387' },
{ name: 'Botswana', code: 'BW', phoneCode: '+267' },
{ name: 'Brazil', code: 'BR', phoneCode: '+55' },
{ name: 'British Indian Ocean Territory', code: 'IO', phoneCode: '+246' },
{ name: 'Brunei Darussalam', code: 'BN', phoneCode: '+673' },
{ name: 'Bulgaria', code: 'BG', phoneCode: '+359' },
{ name: 'Burkina Faso', code: 'BF', phoneCode: '+226' },
{ name: 'Burundi', code: 'BI', phoneCode: '+257' },
{ name: 'Cambodia', code: 'KH', phoneCode: '+855' },
{ name: 'Cameroon', code: 'CM', phoneCode: '+237' },
{ name: 'Canada', code: 'CA', phoneCode: '+1' },
{ name: 'Central African Republic', code: 'CF', phoneCode: '+236' },
{ name: 'Chile', code: 'CL', phoneCode: '+56' },
{ name: 'China', code: 'CN', phoneCode: '+86' },
{ name: 'Colombia', code: 'CO', phoneCode: '+57' },
{ name: 'Comoros', code: 'KM', phoneCode: '+269' },
{ name: 'Congo', code: 'CG', phoneCode: '+242' },
{ name: 'Cook Islands', code: 'CK', phoneCode: '+682' },
{ name: 'Costa Rica', code: 'CR', phoneCode: '+506' },
{ name: 'Côte d\'Ivoire', code: 'CI', phoneCode: '+225' },
{ name: 'Croatia', code: 'HR', phoneCode: '+385' },
{ name: 'Cuba', code: 'CU', phoneCode: '+53' },
{ name: 'Cyprus', code: 'CY', phoneCode: '+357' },
{ name: 'Czech Republic', code: 'CZ', phoneCode: '+420' },
{ name: 'Democratic Republic of the Congo', code: 'CD', phoneCode: '+243' },
{ name: 'Denmark', code: 'DK', phoneCode: '+45' },
{ name: 'Djibouti', code: 'DJ', phoneCode: '+253' },
{ name: 'Dominica', code: 'DM', phoneCode: '+1' },
{ name: 'Dominican Republic', code: 'DO', phoneCode: '+1' },
{ name: 'East African Community', code: 'EAC', phoneCode: '+255' },
{ name: 'Ecuador', code: 'EC', phoneCode: '+593' },
{ name: 'Egypt', code: 'EG', phoneCode: '+20' },
{ name: 'El Salvador', code: 'SV', phoneCode: '+503' },
{ name: 'England', code: 'GB-ENG', phoneCode: '+44' },
{ name: 'Equatorial Guinea', code: 'GQ', phoneCode: '+240' },
{ name: 'Eritrea', code: 'ER', phoneCode: '+291' },
{ name: 'Eswatini', code: 'SZ', phoneCode: '+268' },
{ name: 'Ethiopia', code: 'ET', phoneCode: '+251' },
{ name: 'Falkland Islands', code: 'FK', phoneCode: '+500' },
{ name: 'Federated States of Micronesia', code: 'FM', phoneCode: '+691' },
{ name: 'Fiji', code: 'FJ', phoneCode: '+679' },
{ name: 'Finland', code: 'FI', phoneCode: '+358' },
{ name: 'France', code: 'FR', phoneCode: '+33' },
{ name: 'French Guiana', code: 'GF', phoneCode: '+594' },
{ name: 'French Polynesia', code: 'PF', phoneCode: '+689' },
{ name: 'Gabon', code: 'GA', phoneCode: '+241' },
{ name: 'Gambia', code: 'GM', phoneCode: '+220' },
{ name: 'Georgia', code: 'GE', phoneCode: '+995' },
{ name: 'Germany', code: 'DE', phoneCode: '+49' },
{ name: 'Ghana', code: 'GH', phoneCode: '+233' },
{ name: 'Gibraltar', code: 'GI', phoneCode: '+350' },
{ name: 'Greece', code: 'GR', phoneCode: '+30' },
{ name: 'Greenland', code: 'GL', phoneCode: '+299' },
{ name: 'Grenada', code: 'GD', phoneCode: '+1' },
{ name: 'Guadeloupe', code: 'GP', phoneCode: '+590' },
{ name: 'Guam', code: 'GU', phoneCode: '+1' },
{ name: 'Guatemala', code: 'GT', phoneCode: '+502' },
{ name: 'Guinea', code: 'GN', phoneCode: '+224' },
{ name: 'Guinea-Bissau', code: 'GW', phoneCode: '+245' },
{ name: 'Guyana', code: 'GY', phoneCode: '+592' },
{ name: 'Haiti', code: 'HT', phoneCode: '+509' },
{ name: 'Holy See', code: 'VA', phoneCode: '+379' },
{ name: 'Honduras', code: 'HN', phoneCode: '+504' },
{ name: 'Hong Kong', code: 'HK', phoneCode: '+852' },
{ name: 'Hungary', code: 'HU', phoneCode: '+36' },
{ name: 'Iceland', code: 'IS', phoneCode: '+354' },
{ name: 'India', code: 'IN', phoneCode: '+91' },
{ name: 'Indonesia', code: 'ID', phoneCode: '+62' },
{ name: 'Iran', code: 'IR', phoneCode: '+98' },
{ name: 'Iraq', code: 'IQ', phoneCode: '+964' },
{ name: 'Ireland', code: 'IE', phoneCode: '+353' },
{ name: 'Israel', code: 'IL', phoneCode: '+972' },
{ name: 'Italy', code: 'IT', phoneCode: '+39' },
{ name: 'Jamaica', code: 'JM', phoneCode: '+1' },
{ name: 'Japan', code: 'JP', phoneCode: '+81' },
{ name: 'Jersey', code: 'JE', phoneCode: '+44' },
{ name: 'Jordan', code: 'JO', phoneCode: '+962' },
{ name: 'Kazakhstan', code: 'KZ', phoneCode: '+7' },
{ name: 'Kenya', code: 'KE', phoneCode: '+254' },
{ name: 'Kiribati', code: 'KI', phoneCode: '+686' },
{ name: 'Kuwait', code: 'KW', phoneCode: '+965' },
{ name: 'Kyrgyzstan', code: 'KG', phoneCode: '+996' },
{ name: 'Laos', code: 'LA', phoneCode: '+856' },
{ name: 'Latvia', code: 'LV', phoneCode: '+371' },
{ name: 'Lebanon', code: 'LB', phoneCode: '+961' },
{ name: 'Lesotho', code: 'LS', phoneCode: '+266' },
{ name: 'Liberia', code: 'LR', phoneCode: '+231' },
{ name: 'Libya', code: 'LY', phoneCode: '+218' },
{ name: 'Liechtenstein', code: 'LI', phoneCode: '+423' },
{ name: 'Lithuania', code: 'LT', phoneCode: '+370' },
{ name: 'Luxembourg', code: 'LU', phoneCode: '+352' },
{ name: 'Macao', code: 'MO', phoneCode: '+853' },
{ name: 'Madagascar', code: 'MG', phoneCode: '+261' },
{ name: 'Malawi', code: 'MW', phoneCode: '+265' },
{ name: 'Malaysia', code: 'MY', phoneCode: '+60' },
{ name: 'Maldives', code: 'MV', phoneCode: '+960' },
{ name: 'Mali', code: 'ML', phoneCode: '+223' },
{ name: 'Malta', code: 'MT', phoneCode: '+356' },
{ name: 'Marshall Islands', code: 'MH', phoneCode: '+692' },
{ name: 'Martinique', code: 'MQ', phoneCode: '+596' },
{ name: 'Mauritania', code: 'MR', phoneCode: '+222' },
{ name: 'Mauritius', code: 'MU', phoneCode: '+230' },
{ name: 'Mexico', code: 'MX', phoneCode: '+52' },
{ name: 'Moldova', code: 'MD', phoneCode: '+373' },
{ name: 'Monaco', code: 'MC', phoneCode: '+377' },
{ name: 'Mongolia', code: 'MN', phoneCode: '+976' },
{ name: 'Montenegro', code: 'ME', phoneCode: '+382' },
{ name: 'Montserrat', code: 'MS', phoneCode: '+1' },
{ name: 'Morocco', code: 'MA', phoneCode: '+212' },
{ name: 'Mozambique', code: 'MZ', phoneCode: '+258' },
{ name: 'Myanmar', code: 'MM', phoneCode: '+95' },
{ name: 'Namibia', code: 'NA', phoneCode: '+264' },
{ name: 'Nauru', code: 'NR', phoneCode: '+674' },
{ name: 'Nepal', code: 'NP', phoneCode: '+977' },
{ name: 'Netherlands', code: 'NL', phoneCode: '+31' },
{ name: 'New Zealand', code: 'NZ', phoneCode: '+64' },
{ name: 'Nicaragua', code: 'NI', phoneCode: '+505' },
{ name: 'Niger', code: 'NE', phoneCode: '+227' },
{ name: 'Nigeria', code: 'NG', phoneCode: '+234' },
{ name: 'Niue', code: 'NU', phoneCode: '+683' },
{ name: 'Norfolk Island', code: 'NF', phoneCode: '+672' },
{ name: 'North Macedonia', code: 'MK', phoneCode: '+389' },
{ name: 'Norway', code: 'NO', phoneCode: '+47' },
{ name: 'Oman', code: 'OM', phoneCode: '+968' },
{ name: 'Pakistan', code: 'PK', phoneCode: '+92' },
{ name: 'Palau', code: 'PW', phoneCode: '+680' },
{ name: 'Palestine', code: 'PS', phoneCode: '+970' },
{ name: 'Panama', code: 'PA', phoneCode: '+507' },
{ name: 'Papua New Guinea', code: 'PG', phoneCode: '+675' },
{ name: 'Paraguay', code: 'PY', phoneCode: '+595' },
{ name: 'Peru', code: 'PE', phoneCode: '+51' },
{ name: 'Philippines', code: 'PH', phoneCode: '+63' },
{ name: 'Poland', code: 'PL', phoneCode: '+48' },
{ name: 'Portugal', code: 'PT', phoneCode: '+351' },
{ name: 'Puerto Rico', code: 'PR', phoneCode: '+1' },
{ name: 'Qatar', code: 'QA', phoneCode: '+974' },
{ name: 'Romania', code: 'RO', phoneCode: '+40' },
{ name: 'Russia', code: 'RU', phoneCode: '+7' },
{ name: 'Rwanda', code: 'RW', phoneCode: '+250' },
{ name: 'Saint Helena', code: 'SH', phoneCode: '+290' },
{ name: 'Saint Kitts and Nevis', code: 'KN', phoneCode: '+1' },
{ name: 'Saint Lucia', code: 'LC', phoneCode: '+1' },
{ name: 'Saint Pierre and Miquelon', code: 'PM', phoneCode: '+508' },
{ name: 'Saint Vincent and the Grenadines', code: 'VC', phoneCode: '+1' },
{ name: 'Samoa', code: 'WS', phoneCode: '+685' },
{ name: 'San Marino', code: 'SM', phoneCode: '+378' },
{ name: 'Sao Tome and Principe', code: 'ST', phoneCode: '+239' },
{ name: 'Saudi Arabia', code: 'SA', phoneCode: '+966' },
{ name: 'Scotland', code: 'GB-SCT', phoneCode: '+44' },
{ name: 'Senegal', code: 'SN', phoneCode: '+221' },
{ name: 'Serbia', code: 'RS', phoneCode: '+381' },
{ name: 'Seychelles', code: 'SC', phoneCode: '+248' },
{ name: 'Sierra Leone', code: 'SL', phoneCode: '+232' },
{ name: 'Singapore', code: 'SG', phoneCode: '+65' },
{ name: 'Sint Eustatius and Saba', code: 'BQ-SE', phoneCode: '+599' },
{ name: 'Sint Maarten', code: 'SX', phoneCode: '+1' },
{ name: 'Slovakia', code: 'SK', phoneCode: '+421' },
{ name: 'Slovenia', code: 'SI', phoneCode: '+386' },
{ name: 'Solomon Islands', code: 'SB', phoneCode: '+677' },
{ name: 'Somalia', code: 'SO', phoneCode: '+252' },
{ name: 'South Africa', code: 'ZA', phoneCode: '+27' },
{ name: 'South Korea', code: 'KR', phoneCode: '+82' },
{ name: 'South Sudan', code: 'SS', phoneCode: '+211' },
{ name: 'Spain', code: 'ES', phoneCode: '+34' },
{ name: 'Sri Lanka', code: 'LK', phoneCode: '+94' },
{ name: 'Sudan', code: 'SD', phoneCode: '+249' },
{ name: 'Suriname', code: 'SR', phoneCode: '+597' },
{ name: 'Sweden', code: 'SE', phoneCode: '+46' },
{ name: 'Switzerland', code: 'CH', phoneCode: '+41' },
{ name: 'Syria', code: 'SY', phoneCode: '+963' },
{ name: 'Taiwan', code: 'TW', phoneCode: '+886' },
{ name: 'Tajikistan', code: 'TJ', phoneCode: '+992' },
{ name: 'Tanzania', code: 'TZ', phoneCode: '+255' },
{ name: 'Thailand', code: 'TH', phoneCode: '+66' },
{ name: 'Timor-Leste', code: 'TL', phoneCode: '+670' },
{ name: 'Togo', code: 'TG', phoneCode: '+228' },
{ name: 'Tokelau', code: 'TK', phoneCode: '+690' },
{ name: 'Tonga', code: 'TO', phoneCode: '+676' },
{ name: 'Trinidad and Tobago', code: 'TT', phoneCode: '+1' },
{ name: 'Tunisia', code: 'TN', phoneCode: '+216' },
{ name: 'Turkey', code: 'TR', phoneCode: '+90' },
{ name: 'Turkmenistan', code: 'TM', phoneCode: '+993' },
{ name: 'Turks and Caicos Islands', code: 'TC', phoneCode: '+1' },
{ name: 'Tuvalu', code: 'TV', phoneCode: '+688' },
{ name: 'Uganda', code: 'UG', phoneCode: '+256' },
{ name: 'Ukraine', code: 'UA', phoneCode: '+380' },
{ name: 'United Arab Emirates', code: 'AE', phoneCode: '+971' },
{ name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
{ name: 'United States of America', code: 'US', phoneCode: '+1' },
{ name: 'Uruguay', code: 'UY', phoneCode: '+598' },
{ name: 'Uzbekistan', code: 'UZ', phoneCode: '+998' },
{ name: 'Vanuatu', code: 'VU', phoneCode: '+678' },
{ name: 'Vatican City', code: 'VA', phoneCode: '+379' },
{ name: 'Venezuela', code: 'VE', phoneCode: '+58' },
{ name: 'Vietnam', code: 'VN', phoneCode: '+84' },
{ name: 'Virgin Islands, British', code: 'VG', phoneCode: '+1' },
{ name: 'Virgin Islands, U.S.', code: 'VI', phoneCode: '+1' },
{ name: 'Yemen', code: 'YE', phoneCode: '+967' },
{ name: 'Zambia', code: 'ZM', phoneCode: '+260' },
{ name: 'Zimbabwe', code: 'ZW', phoneCode: '+263' },

];

currentCountry = { name: 'Bangladesh', code: 'BD', phoneCode: '+880' }; 
currentFlagPath = this.filePath['Bangladesh'];
filteredCountriesList = this.countrie;

  facilitiesForDisabilitiesControl = new FormControl(false);
  isPolicyAcceptedControl = new FormControl(false);
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
  //

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
    //
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
private fetchIndustryTypes(industryId: number = 0): void {
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
        } else {
          console.warn(
            `No industry types found for IndustryId: ${industryId}.`
          );
          this.industryTypes = []; 
        }
      } else {
        console.error('Unexpected error response:', response.error);
        this.industryTypes = []; 
      }
    },
    error: (error: any) => {
      console.error('Error fetching industry types:', error);
      this.industryTypes = []; 
    }
  });
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

  onCategoryChange(event: any): void {
    this.onIndustryTypeChange(event.target.value); 
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