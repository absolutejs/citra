import type { Dispatch, SetStateAction } from 'react';
import { buttonStyle } from '../utils/styles';
import { Modal } from './Modal';
import { AuthOptions } from './AuthOptions';

type NavbarProps = {
	modalOpen: boolean;
	setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const Navbar = ({ modalOpen, setModalOpen }: NavbarProps) => {
	return (
		<header
			style={{
				position: 'relative',
				backgroundColor: '#0C1015',
				padding: '10px 20px',
				color: '#fff',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<a
				style={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					textDecoration: 'none',
					color: '#fff'
				}}
				href="/"
			>
				Citra
			</a>

			{modalOpen && (
				<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
					<AuthOptions />
				</Modal>
			)}
		</header>
	);
};
