import { Head } from '../components/Head';
import { Navbar } from '../components/Navbar';

import { htmlDefault, bodyDefault, mainDefault } from '../utils/styles';

export const Documentation = () => {
	return (
		<html lang="en" style={htmlDefault}>
			<Head />
			<body style={bodyDefault}>
				<Navbar />
				<main style={mainDefault}></main>
			</body>
		</html>
	);
};
