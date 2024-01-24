import { createContext } from 'react';
import { MobileApp } from '../../../../../data';

const SelectedMobile = createContext<MobileApp | null>(null);

export default SelectedMobile;
