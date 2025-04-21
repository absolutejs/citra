import type { Dispatch, SetStateAction } from 'react';
import { buttonStyle } from '../utils/styles';
import { Modal } from './Modal';
import { AuthOptions } from './AuthOptions';

type NavbarProps = {
	modalOpen: boolean;
	setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const navLinks = [
	{ href: '/page1', label: 'Page 1' },
	{ href: '/page2', label: 'Page 2' },
	{ href: '/protected', label: 'Protected' }
];

export const Navbar = ({
	modalOpen,
	setModalOpen
}: NavbarProps) => {
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
				Absolute Auth
			</a>

			<nav style={{ display: 'flex', alignItems: 'center' }}>
				{navLinks.map(({ href, label }, index) => (
					<a
						key={index}
						href={href}
						style={{
							textDecoration: 'none',
							fontSize: '1rem',
							textWrap: 'nowrap',
							fontWeight: 'bold',
							marginRight: '20px',
							padding: '5px 10px',
							borderRadius: '5px',
							color: '#fff'
						}}
					>
						{label}
					</a>
				))}
				
				{modalOpen && (
					<Modal
						isOpen={modalOpen}
						onClose={() => setModalOpen(false)}
					>
						<AuthOptions />
					</Modal>
				)}
			</nav>
		</header>
	);
};
