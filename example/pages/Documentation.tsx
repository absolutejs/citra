import { Head } from '../components/page/Head';
import { Navbar } from '../components/page/Navbar';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { htmlDefault, bodyDefault, mainDefault } from '../styles/styles';

export const Documentation = () => {
	const { user, handleSignOut } = useAuthStatus();

	return (
		<html lang="en" style={htmlDefault}>
			<Head />
			<body style={bodyDefault}>
				<Navbar user={user} handleSignOut={handleSignOut} />
				<main style={mainDefault} />
			</body>
		</html>
	);
};
