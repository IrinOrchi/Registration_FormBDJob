import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocationResponseDTO } from '../../Models/company';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-country-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './country-dropdown.component.html',
  styleUrl: './country-dropdown.component.scss'
})
export class CountryDropdownComponent {
  @Input() selectedCountry: LocationResponseDTO | null = null;
  @Output() countrySelected = new EventEmitter<LocationResponseDTO>();
  @Input() formcontrol: FormControl = new FormControl();

  toggleDropdown() {
  }

  selectCountry(country: LocationResponseDTO) {
    this.countrySelected.emit(country);
  }
}

