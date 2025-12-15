import React, { useState, useRef, useEffect } from 'react';
import { IonSearchbar, IonText } from '@ionic/react';
import { COUNTRY_CODES, CountryCode } from '../utils/countryCodes';
import './PhoneInput.css';

interface PhoneInputProps {
  phoneNumber: string;
  countryCode: string;
  onPhoneChange: (phone: string) => void;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneNumber,
  countryCode,
  onPhoneChange,
  onCountryCodeChange,
  placeholder = '5XX XXX XX XX',
  maxLength = 10,
  disabled = false
}) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<CountryCode[]>(COUNTRY_CODES);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredCountries(COUNTRY_CODES);
    } else {
      const lowerValue = value.toLowerCase();
      setFilteredCountries(
        COUNTRY_CODES.filter(c =>
          c.name.toLowerCase().includes(lowerValue) ||
          c.code.includes(lowerValue)
        )
      );
    }
  };

  const handleSelectCountry = (country: CountryCode) => {
    onCountryCodeChange(country.code);
    setShowCountryDropdown(false);
    setSearchText('');
    setFilteredCountries(COUNTRY_CODES);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    onPhoneChange(value);
  };

  return (
    <div className="phone-input-wrapper">
      <label className="input-label">Telefon Numarası</label>
      <div className="phone-input-container">
        {/* Country Code Select */}
        <div className="country-code-select" ref={dropdownRef}>
          <button
            type="button"
            className="country-code-button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            disabled={disabled}
          >
            <span className="flag">{selectedCountry?.flag}</span>
            <span className="code">{countryCode}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showCountryDropdown && (
            <div className="country-dropdown">
              <div className="dropdown-search">
                <IonSearchbar
                  value={searchText}
                  onIonChange={(e) => handleCountrySearch(e.detail.value || '')}
                  placeholder="Ülke ara..."
                  className="country-search"
                />
              </div>
              <div className="country-list">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={`${country.code}-${country.name}`}
                      className={`country-item ${
                        countryCode === country.code ? 'selected' : ''
                      }`}
                      onClick={() => handleSelectCountry(country)}
                    >
                      <span className="flag">{country.flag}</span>
                      <span className="name">{country.name}</span>
                      <span className="code">{country.code}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <IonText color="medium">Ülke bulunamadı</IonText>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          className="phone-number-input"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode="numeric"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
