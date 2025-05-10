import { Head } from '../components/page/Head';
import { Navbar } from '../components/page/Navbar';
import { htmlDefault, bodyDefault, mainDefault } from '../styles/styles';

export const Documentation = () => (
	<html lang="en" style={htmlDefault}>
		<Head />
		<body style={bodyDefault}>
			<Navbar />
			<main style={mainDefault} />
		</body>
	</html>
);
