import { CSSProperties } from 'react';
import { providers } from '../../src/providers';
import { isValidProviderOption } from '../../src/typeGuards';
import { Head } from '../components/page/Head';
import { Navbar } from '../components/page/Navbar';

import { htmlDefault, bodyDefault, mainDefault } from '../utils/styles';

const legendWrapperStyle: CSSProperties = {
	backgroundColor: '#fff',
	border: '1px solid #ddd',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	margin: '0 auto 2rem',
	maxWidth: '800px',
	padding: '20px',
	width: '100%'
};

const legendTitleStyle: CSSProperties = {
	fontSize: '1.25rem',
	fontWeight: 600,
	margin: '0 0 16px',
	textAlign: 'center'
};

const legendGridStyle: CSSProperties = {
	alignItems: 'center',
	columnGap: '12px',
	display: 'grid',
	gridTemplateColumns: '8ch auto',
	margin: '0 auto',
	rowGap: '12px',
	width: 'max-content'
};

const legendFooterStyle: CSSProperties = {
	margin: '16px 0 0',
	textAlign: 'center'
};

const badgeStyle = (backgroundColor: string): CSSProperties => ({
	alignItems: 'center',
	backgroundColor,
	borderRadius: '4px',
	boxSizing: 'border-box',
	color: '#fff',
	display: 'inline-flex',
	fontSize: '0.9rem',
	fontWeight: 500,
	justifyContent: 'center',
	padding: '4px 12px',
	width: '8ch'
});

const legendTextStyle: CSSProperties = {
	fontSize: '1rem',
	lineHeight: 1.6,
	margin: 0,
	textAlign: 'left'
};

export const Testing = () => {
	const providerOptions = Object.keys(providers).filter(
		isValidProviderOption
	);

	return (
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
						Citra currently supports {providerOptions.length} OAuth
						2.0 providers
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
						tab—you'll find instructions for obtaining client
						credentials and controls to exercise each step of the
						OAuth 2.0 flow.
					</p>

					<div style={legendWrapperStyle}>
						<h2 style={legendTitleStyle}>Status Key</h2>
						<div style={legendGridStyle}>
							<span style={badgeStyle('#888')}>Untested</span>
							<p style={legendTextStyle}>
								Pending external or restricted access.
							</p>

							<span style={badgeStyle('#4caf50')}>Tested</span>
							<p style={legendTextStyle}>
								Verified routes actively working and
								community-tested.
							</p>

							<span style={badgeStyle('#e53935')}>Failed</span>
							<p style={legendTextStyle}>
								Library or endpoint issues (not user error).
							</p>
						</div>

						<p style={legendFooterStyle}>
							Every test here updates our database in real time,
							informing all users which routes are working.
						</p>
					</div>

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
};
