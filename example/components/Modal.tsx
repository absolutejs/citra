import { ReactNode, useEffect, useRef, MouseEvent } from 'react';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialogElement = dialogRef.current;
		if (!dialogElement) return;
		if (isOpen) {
			dialogElement.showModal();
			document.body.style.overflow = 'hidden';
		} else {
			dialogElement.close();
			document.body.style.overflow = '';
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<dialog
			ref={dialogRef}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onClick={(event: MouseEvent<HTMLDialogElement>) => {
				if (event.target === dialogRef.current) {
					onClose();
				}
			}}
			style={{
				border: 'none',
				borderRadius: '8px',
				left: '50%',
				padding: '0px',
				position: 'fixed',
				top: '50%',
				transform: 'translate(-50%, -50%)'
			}}
		>
			<style>
				{`
					dialog::backdrop {
						background-color: rgba(0, 0, 0, 0.5);
						backdrop-filter: blur(4px);
					}
				`}
			</style>
			<div
				style={{
					backgroundColor: '#fff',
					borderRadius: '8px',
					minWidth: '300px',
					padding: '20px',
					position: 'relative'
				}}
				onClick={(event) => event.stopPropagation()}
			>
				<button
					onClick={onClose}
					aria-label="Close modal"
					style={{
						background: 'transparent',
						border: 'none',
						cursor: 'pointer',
						fontSize: '16px',
						position: 'absolute',
						right: '10px',
						top: '10px'
					}}
				>
					&times;
				</button>
				{children}
			</div>
		</dialog>
	);
};
