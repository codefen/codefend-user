import { createContext } from 'react';
import { SupportProps } from '../../../../../data';

const SelectedTicket = createContext<string>('');

export default SelectedTicket;
