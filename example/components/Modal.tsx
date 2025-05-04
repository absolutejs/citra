import { ReactNode, useEffect, useRef, MouseEvent } from 'react';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: (dialogRef: HTMLDialogElement | null) => void;
	children: ReactNode;
};

export const Modal = ({ isOpen, onClose, onOpen, children }: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
			onOpen(dialog);
			document.body.style.overflow = 'hidden';
		} else if (dialog.open) {
			dialog.close();
			onClose();
			document.body.style.overflow = '';
		}
	}, [isOpen]);

	return (
		<dialog
			ref={dialogRef}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onClick={(event: MouseEvent<HTMLDialogElement>) => {
				if (event.target === dialogRef.current) onClose();
			}}
			style={{
				position: 'fixed',
				inset: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				border: 'none',
				padding: '0px',
				 margin: 'auto', 
				 borderRadius: '8px',
			}}
		>
			<style>{`
				dialog::backdrop {
					background: rgba(0,0,0,0.5);
					backdrop-filter: blur(4px);
				}
			`}</style>

			<div
				onClick={(event) => event.stopPropagation()}
				style={{
					backgroundColor: '#fff',
					minWidth: '300px',
					padding: '20px',
					position: 'relative'
				}}
			>
				<button
					onClick={() => dialogRef.current?.close()}
					aria-label="Close modal"
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						background: 'transparent',
						border: 'none',
						fontSize: '16px',
						cursor: 'pointer'
					}}
				>
					&times;
				</button>
				{children}
			</div>
		</dialog>
	);
};
