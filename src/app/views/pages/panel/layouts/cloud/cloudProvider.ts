import { createContext } from 'react';
import { CloudApp } from '../../../../../data';

const SelectedCloud = createContext<CloudApp | null>(null);

export default SelectedCloud;
