import { Navbar } from '../components/Navbar';
import {
	htmlDefault,
	bodyDefault,
	mainDefault,
	buttonStyle,
	contentStyle
} from '../utils/styles';

import { useState } from 'react';
import { Head } from '../components/Head';

export const Example = () => {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<html lang="en" style={htmlDefault}>
			<Head />
			<body style={bodyDefault}>
				<Navbar
					modalOpen={modalOpen}
					setModalOpen={setModalOpen}
				/>
				<main style={mainDefault}>
					<div style={contentStyle}>
						<h1>Welcome to Citra Example</h1>
						<p>
							Use the signin to test auth flow with a provider
						</p>
					</div>
				</main>
			</body>
		</html>
	);
};
