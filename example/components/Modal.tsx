import { ReactNode, MouseEvent, useEffect, useRef } from 'react';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	const backgroundRef = useRef<HTMLDivElement>(null);

	const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			// Focus the background div to ensure its onKeyDown gets events.
			backgroundRef.current?.focus();
		} else {
			document.body.style.overflow = '';
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={backgroundRef}
			role="button"
			tabIndex={0}
			onKeyDown={(event) => {
				if (event.key === 'Escape') {
					onClose();
				}
			}}
			onClick={handleBackgroundClick}
			style={{
				alignItems: 'center',
				backdropFilter: 'blur(4px)',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				height: '100%',
				justifyContent: 'center',
				left: 0,
				position: 'fixed',
				top: 0,
				width: '100%',
				zIndex: 10000
			}}
		>
			<div
				style={{
					backgroundColor: '#fff',
					borderRadius: '8px',
					minWidth: '300px',
					padding: '20px',
					position: 'relative'
				}}
			>
				<button
					onClick={onClose}
					style={{
						backgroundColor: 'transparent',
						border: 'none',
						cursor: 'pointer',
						fontSize: '16px',
						position: 'absolute',
						right: '10px',
						top: '10px'
					}}
					aria-label="Close modal"
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};