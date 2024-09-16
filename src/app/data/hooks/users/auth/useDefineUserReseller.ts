import { useFindResellerArea } from '../common/useFindResellerArea';
import { defaultCountries, topCountriesOnList } from '@/app/constants/countries';
import { useState } from 'react';

export const useDefineUserReseller = () => {
  const [resellers, findResellers, setResellers] = useFindResellerArea();
  const [companyCountry, setCompanyCountry] = useState('');
  const [reseller, setReseller] = useState<any>({ id: '', name: '' });

  const updateResellerArea = (e: any) => {
    setCompanyCountry(e.target.value);
    const country = defaultCountries.find(country => country.name == e.target.value);
    if (topCountriesOnList.includes(country?.name || '')) {
      setResellers([]);
      setReseller({ id: '1', name: 'Codefend' });
    } else {
      setReseller({ id: '', name: '' });
      findResellers(country ? country.alpha2Code : '');
    }
  };

  const updateReseller = (e: any) => {
    const { value } = e.target;
    setReseller(resellers.find(reseller => reseller.id == value) || { id: '', name: '' });
  };

  return { updateReseller, updateResellerArea, resellers, companyCountry, reseller };
};
