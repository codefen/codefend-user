import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import css from './phoneinput.module.scss';
import { defaultCountries, type Countries } from '@/app/constants/countries';
import { SelectDropdown } from '../SelectDropdown/SelectDropdown';

interface PhoneInputProps {
  name: string;
  placeholder?: string;
  defaultCountry: string;
  defaultPhone?: string;
  changeCountryCode?: (country: Countries) => void;
}

export default function PhoneInput({
  name = '',
  placeholder = 'Enter phone number',
  defaultPhone = '',
  defaultCountry = '',
  changeCountryCode,
}: PhoneInputProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Countries>(
    defaultCountries?.filter?.(i => i?.alpha2Code === defaultCountry)?.[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const selectedCountryFull = defaultCountries?.filter?.(
      i => i?.alpha2Code === defaultCountry
    )?.[0];
    setSelectedCountry(selectedCountryFull);
    setPhoneNumber(defaultPhone);
    setFullPhoneNumber(`+${selectedCountryFull?.callingCodes?.[0]}***${defaultPhone}`);
  }, [defaultCountry, defaultPhone]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
    setFullPhoneNumber(`+${selectedCountry?.callingCodes?.[0]}***${value}`);
  };

  const handleCountrySelect = (country: Countries) => {
    setSelectedCountry(country);
    setIsOpen(false);
    if (changeCountryCode) {
      changeCountryCode(country);
    }
  };

  return (
    <div className={css['phoneInputContainer']}>
      <div className={css['phoneInputContent']}>
        <div className={css['countrySelector']}>
          <div
            role="button"
            className={css['selected-country']}
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)}>
            <span className={`flag flag-${selectedCountry?.alpha2Code?.toLowerCase?.()}`}></span>
            <span className={css['countryCode']}>+{selectedCountry?.callingCodes?.[0]}</span>
            <span className={`${css['arrow']} ${isOpen ? css['open'] : ''}`}>▼</span>
          </div>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
        />
      </div>
      <SelectDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} triggerRef={triggerRef}>
        <div className={css['country-list']}>
          {defaultCountries.map(country => (
            <button
              key={`${country?.alpha2Code}${country?.name}`}
              onClick={() => handleCountrySelect(country)}>
              <span className={`flag flag-${country?.alpha2Code?.toLowerCase?.()}`}></span>
              <span className={css['country-name']}>{country?.name}</span>
              <span className="text-gray-400 ml-auto">+{country?.callingCodes?.[0]}</span>
            </button>
          ))}
        </div>
      </SelectDropdown>
      <input type="hidden" name={name} value={fullPhoneNumber} />
    </div>
  );
}
