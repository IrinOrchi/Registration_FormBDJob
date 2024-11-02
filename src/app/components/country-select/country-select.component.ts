import { Component, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Country {
  id: string;
  name: string;
  logoUrl: string;
}

@Component({
  selector: 'app-country-select',
  standalone: true,
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries = signal<Country[]>([]);
  searchControl = new FormControl('');
  selectedCountry: Country | null = null;
  showDropdown = false;

  ngOnInit(): void {
    // Fetch countries from the backend
    this.fetchCountries();

    // Filter countries as the user types
    this.searchControl.valueChanges.subscribe((searchTerm) => {
      this.filterCountries(searchTerm || '');
    });
  }

  private fetchCountries(): void {
    // Replace with actual API call to fetch countries
    const apiResponse = [
      { countryId: '1', countryName: 'Bahamas' },
      { countryId: '2', countryName: 'Bahrain' },
      { countryId: '3', countryName: 'Bangladesh' },
      { countryId: '4', countryName: 'Barbados' }
      // more countries...
    ];

    this.countries = apiResponse.map((country) => ({
      id: country.countryId,
      name: country.countryName,
      logoUrl: `/assets/flags/${country.countryId}.png`, // Assume flag images are named by country ID
    }));

    this.filteredCountries.set(this.countries);
  }

  private filterCountries(searchTerm: string): void {
    const filtered = this.countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.filteredCountries.set(filtered);
  }

  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.showDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}
