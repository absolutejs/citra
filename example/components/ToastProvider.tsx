import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import { TOAST_DURATION } from '../utils/constants';
import { Toast } from './Toast';

type Toast = {
	id: number;
	message: string;
	action?: { label: string; onClick: () => void };
	style?: { background?: string; color?: string };
};

type AddToastProps = {
	message: string;
	action?: Toast['action'];
	style?: Toast['style'];
	duration?: number;
};

export type ToastContextType = {
	addToast: (opts: AddToastProps) => void;
	registerHost: (host: HTMLElement | null) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);
export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [host, setHost] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setHost(document.body);
	}, []);

	const addToast = ({
		message,
		action,
		style,
		duration = TOAST_DURATION
	}: AddToastProps) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, action, style }]);
		if (duration > 0) setTimeout(() => removeToast(id), duration);
	};

	const removeToast = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	const registerHost = (element: HTMLElement | null) =>
		setHost(element ?? document.body);

	return (
		<ToastContext.Provider value={{ addToast, registerHost }}>
			{children}
			{host &&
				createPortal(
					<div
						style={{
							position: 'fixed',
							bottom: '1rem',
							right: '1rem',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-end',
							zIndex: 10000
						}}
					>
						{toasts.map((t) => (
							<Toast
								key={t.id}
								message={t.message}
								action={t.action}
								style={t.style}
								removeToast={() => removeToast(t.id)}
							/>
						))}
					</div>,
					host
				)}
		</ToastContext.Provider>
	);
};
