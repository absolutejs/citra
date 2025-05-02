import { createContext, useContext, useState, ReactNode } from 'react';

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
export const useToast = (): ToastContextType => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within ToastProvider');

	return ctx;
};

type ToastProviderProps = { children: ReactNode };

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = ({
		message,
		action,
		style,
		duration = 5000
	}: {
		message: string;
		action?: Toast['action'];
		style?: Toast['style'];
		duration?: number;
	}) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { action, id, message, style }]);
		if (duration > 0) setTimeout(() => removeToast(id), duration);
	};

	const removeToast = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
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
					<div
						key={id}
						style={{
							alignItems: 'flex-start',
							background: style?.background || '#333',
							borderRadius: '0.5rem',
							boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
							color: style?.color || '#fff',
							display: 'flex',
							gap: '1rem',
							marginBottom: '0.625rem',
							maxWidth: '300px',
							overflow: 'visible',
							padding: '0.75rem',
							paddingRight: '2.5rem',
							position: 'relative'
						}}
						onMouseEnter={(e) =>
							((
								e.currentTarget.querySelector(
									'.close-btn'
								) as HTMLElement
							).style.opacity = '1')
						}
						onMouseLeave={(e) =>
							((
								e.currentTarget.querySelector(
									'.close-btn'
								) as HTMLElement
							).style.opacity = '0')
						}
					>
						<div
							style={{
								boxSizing: 'border-box',
								direction: 'rtl',
								flex: 1,
								maxHeight: '300px',
								minWidth: 0,
								overflowY: 'auto',
								paddingLeft: '1rem'
							}}
						>
							<span
								style={{
									direction: 'ltr',
									display: 'block',
									fontSize: '0.875rem',
									overflowWrap: 'anywhere',
									wordBreak: 'break-word'
								}}
							>
								{message}
							</span>
						</div>

						{action ? (
							<button
								onClick={() => {
									action.onClick();
									removeToast(id);
								}}
								style={{
									background: '#007BFF',
									border: 'none',
									borderRadius: '0.25rem',
									color: '#fff',
									cursor: 'pointer',
									fontSize: '0.75rem',
									padding: '0.375rem 0.625rem'
								}}
							>
								{action.label}
							</button>
						) : null}

						<button
							className="close-btn"
							onClick={() => removeToast(id)}
							style={{
								background: 'transparent',
								border: 'none',
								color: 'inherit',
								cursor: 'pointer',
								fontSize: '0.875rem',
								fontWeight: 'bold',
								opacity: 0,
								position: 'absolute',
								right: '0.5rem',
								top: '0.5rem',
								transition: 'opacity 0.2s ease-in-out'
							}}
						>
							✕
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};
