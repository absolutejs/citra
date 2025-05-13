import { providerOptions } from '../../src/providers';
import { Head } from '../components/page/Head';
import { Navbar } from '../components/page/Navbar';
import { Legend } from '../components/testing/Legend';
import { htmlDefault, bodyDefault, mainDefault } from '../styles/styles';

export const Testing = () => (
	<html lang="en" style={htmlDefault}>
		<Head />
		<body style={bodyDefault}>
			<Navbar />
			<main style={mainDefault}>
				<h1
					style={{
						color: '#222',
						fontSize: '2.25rem',
						fontWeight: 600,
						margin: '2rem 0',
						textAlign: 'center'
					}}
				>
					Citra currently supports {providerOptions.length} OAuth 2.0
					providers
				</h1>

				<p
					style={{
						backgroundColor: '#fff',
						border: '1px solid #ddd',
						borderRadius: '8px',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
						margin: '0 auto 2rem',
						maxWidth: '800px',
						padding: '20px',
						textAlign: 'center'
					}}
				>
					Below is a list of all supported providers, including
					relevant information tags and their current status.
					<br />
					<br />
					Test providers from this screen by opening a provider's
					tab—you'll find a link to create an OAuth app on that
					provider and controls to exercise each step of the OAuth 2.0
					flow.
				</p>

				<Legend />

				<div
					style={{
						display: 'grid',
						gap: '12px',
						gridTemplateColumns:
							'repeat(auto-fill, minmax(180px, 1fr))',
						margin: '0 auto 2rem',
						maxWidth: '800px',
						width: '100%'
					}}
				>
					{providerOptions.map((provider) => (
						<button
							key={provider}
							style={{
								alignItems: 'center',
								backgroundColor: '#fff',
								border: '1px solid #ddd',
								borderRadius: '4px',
								cursor: 'pointer',
								display: 'flex',
								fontSize: '0.9rem',
								height: '40px',
								justifyContent: 'center',
								padding: '10px',
								textAlign: 'center'
							}}
						>
							{provider}
						</button>
					))}
				</div>
			</main>
		</body>
	</html>
);
