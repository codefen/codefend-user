import React, { createContext, useContext } from 'react';
import { UseScriptStatus, useScript } from 'usehooks-ts';

interface IssueContextType {
	status: UseScriptStatus
}

interface Props {
  children: React.ReactNode;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider= ({ children }: Props) => {
	const status = useScript('/src/editor-lib/visual/mce/tinymce.min.js', {
		removeOnUnmount: true,
	});

	return (
		<IssueContext.Provider
			value={{status}}>
			{children}
		</IssueContext.Provider>
	);
};

// Función para usar el contexto en los componentes
export const useIssueContext = () => {
	const context = useContext(IssueContext);
	if (!context) {
		throw new Error(
			'useIssueContext debe ser usado dentro de un IssueProvider',
		);
	}
	return context;
};
