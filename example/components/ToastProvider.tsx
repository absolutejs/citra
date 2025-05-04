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

type ToastContextType = {
	addToast: (props: {
		message: string;
		action?: Toast['action'];
		style?: Toast['style'];
		duration?: number;
	}) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);
export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
};

type ToastProviderProps = { children: ReactNode };
type AddToastProps = {
	message: string;
	action?: Toast['action'];
	style?: Toast['style'];
	duration?: number;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
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
		setToasts((prev) => [...prev, { action, id, message, style }]);
		if (duration > 0) setTimeout(() => removeToast(id), duration);
	};

	const removeToast = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	const registerHost = (element: HTMLElement | null) => {
		setHost(element ?? document.body);
	};

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			{host &&
				createPortal(
					<div
						style={{
							alignItems: 'flex-end',
							bottom: '1rem',
							display: 'flex',
							flexDirection: 'column',
							position: 'fixed',
							right: '1rem',
							zIndex: 10000
						}}
					>
						{toasts.map(({ id, message, action, style }) => (
							<Toast
								key={id}
								message={message}
								action={action}
								style={style}
								removeToast={() => removeToast(id)}
							/>
						))}
					</div>,
					host
				)}
		</ToastContext.Provider>
	);
};
