export const Navbar = () => {
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
					fontSize: '2rem',
					fontWeight: 'bold',
					textDecoration: 'none',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff'
				}}
				href="/"
			>
				<img
					src="/assets/citra-logo.png"
					alt="Citra Logo"
					style={{ height: '100px', marginRight: '10px' }}
				/>
				Citra Example
			</a>
		</header>
	);
};
