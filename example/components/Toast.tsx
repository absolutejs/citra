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
	const context = useContext(ToastContext);
	if (!context)
		throw new Error('useToast must be used within a ToastProvider');
	return context;
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
		setToasts((prev) => [...prev, { id, message, action, style }]);
		if (duration > 0) setTimeout(() => removeToast(id), duration);
	};

	const removeToast = (id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
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
				{toasts.map(({ id, message, action, style }) => (
					<div
						key={id}
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							gap: '1rem',
							maxWidth: '300px',
							padding: '0.75rem',
							paddingRight: '2.5rem',
							marginBottom: '0.625rem',
							background: style?.background || '#333',
							color: style?.color || '#fff',
							borderRadius: '0.5rem',
							boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
							overflow: 'hidden'
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
						<span
							style={{
								flex: 1,
								minWidth: 0,
								wordBreak: 'break-word',
								overflowWrap: 'anywhere',
								fontSize: '0.875rem'
							}}
						>
							{message}
						</span>

						{action && (
							<button
								onClick={() => {
									action.onClick();
									removeToast(id);
								}}
								style={{
									padding: '0.375rem 0.625rem',
									fontSize: '0.75rem',
									background: '#007BFF',
									color: '#fff',
									border: 'none',
									borderRadius: '0.25rem',
									cursor: 'pointer'
								}}
							>
								{action.label}
							</button>
						)}

						<button
							className="close-btn"
							onClick={() => removeToast(id)}
							style={{
								position: 'absolute',
								top: '0.5rem',
								right: '0.5rem',
								fontSize: '0.875rem',
								fontWeight: 'bold',
								background: 'transparent',
								border: 'none',
								color: 'inherit',
								cursor: 'pointer',
								opacity: 0,
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
