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
					fontSize: '1.5rem',
					fontWeight: 'bold',
					textDecoration: 'none',
					color: '#fff'
				}}
				href="/"
			>
				Citra
			</a>
		</header>
	);
};
