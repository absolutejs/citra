import { Head } from '../components/Head';
import { Navbar } from '../components/Navbar';

import { htmlDefault, bodyDefault, mainDefault } from '../utils/styles';

export const Testing = () => {
	return (
		<html lang="en" style={htmlDefault}>
			<Head />
			<body style={bodyDefault}>
				<Navbar />
				<main style={mainDefault}>
					<h1>Citra currently supports 60 OAuth 2.0 providers</h1>
					<p>
						Below is a list of all supported providers. The
						providers inclue any relevant information tags as well
						as their current status. You can help keep Citra up to
						date by testing providers using this screen.
					</p>
				</main>
			</body>
		</html>
	);
};
