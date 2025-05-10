import { linkStyle } from '../../styles/styles';

export const Navbar = () => (
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

		<a href="/documentation" style={linkStyle}>
			Documentation
		</a>
	</header>
);
