import { User } from '../../db/schema';
import { linkStyle } from '../../styles/styles';
import { NavbarUserButtons } from './NavbarUserButtons';

type NavbarProps = {
	user: User | undefined;
	handleSignOut: () => Promise<void>;
};

export const Navbar = ({ user, handleSignOut }: NavbarProps) => (
	<header
		style={{
			alignItems: 'center',
			backgroundColor: '#0C1015',
			color: '#fff',
			display: 'flex',
			justifyContent: 'space-between',
			padding: '10px 20px',
			position: 'relative'
		}}
	>
		<a
			style={{
				alignItems: 'center',
				color: '#fff',
				display: 'flex',
				fontSize: '2rem',
				fontWeight: 'bold',
				justifyContent: 'center',
				textDecoration: 'none'
			}}
			href="/"
		>
			<img
				src="/assets/citra-logo.png"
				alt="Citra Logo"
				style={{ height: '100px', marginRight: '10px' }}
			/>
			Citra
		</a>

		<nav
			style={{
				display: 'flex',
				gap: '20px'
			}}
		>
			<a href="/documentation" style={linkStyle}>
				Documentation
			</a>

			<a href="/testing" style={linkStyle}>
				Testing
			</a>

			<NavbarUserButtons user={user} handleSignOut={handleSignOut} />
		</nav>
	</header>
);
