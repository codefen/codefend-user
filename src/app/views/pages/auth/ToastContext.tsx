// ToastContext.js
/*
import React, { createContext, useContext, useState } from 'react';
import { Poast } from '../../../../toastify';


interface Props {
	children: React.ReactNode;
}

interface ToastOptions {
	type?: string;
	autoClose?: number;
	position?: string;
  message: string;
}

interface ToastContextType {
	showToast: (message: string, options?: ToastOptions) => void;
	removeToast: (toastToRemove: ToastOptions) => void;
}

const ToastContext = createContext({} as ToastContextType);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error(
			'useCompanyContext must be used within a CompanyContextProvider',
		);
	}
	return context;
};

export const ToastProvider = ({ children }: Props) => {
	const [toasts, setToasts] = useState<any[]>([]);

	const showToast = (message: string, options: Partial<ToastOptions> = {}) => {
    console.log(message)
    const toast: ToastOptions = {
        type: options.type || 'info',
        message,
        autoClose: options.autoClose || 5000,
        position: options.position || 'top-right',
    };

    const newToast = new Poast({
        ...toast,
        onClose: () => removeToast(toast),
    });

    setToasts((prevToasts) => [...prevToasts, newToast]);
};

	const removeToast = (toastToRemove: ToastOptions) => {
		setToasts((prevToasts) =>
			prevToasts.filter((toast) => toast !== toastToRemove),
		);
	};

	return (
		<ToastContext.Provider value={{ showToast, removeToast }}>
			{children}
			{toasts.map((toast, index) => (
				<div key={index}>
					<div className={`toast ${toast.type}`}>
						<span>{toast.message}</span>
						<button onClick={() => removeToast(toast)}>Cerrar</button>
					</div>
				</div>
			))}
		</ToastContext.Provider>
	);
};
*/