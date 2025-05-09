import { useEffect, useState } from 'react';
import { AuthorizeModal } from '../components/AuthorizeModal';
import { FetchProfileModal } from '../components/FetchProfileModal';
import { Head } from '../components/Head';
import { Navbar } from '../components/Navbar';
import { RefreshModal } from '../components/RefreshModal';
import { RevokeModal } from '../components/RevokeModal';
import { ToastProvider } from '../components/ToastProvider';
import {
	htmlDefault,
	bodyDefault,
	mainDefault,
	buttonStyle,
	headingStyle,
	paragraphStyle
} from '../utils/styles';

export const Home = () => {
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [refreshModalOpen, setRefreshModalOpen] = useState(false);
	const [revokeModalOpen, setRevokeModalOpen] = useState(false);
	const [profileModalOpen, setProfileModalOpen] = useState(false);

	// Remove harmless OAuth fragments inserted by Facebook and Reddit
	useEffect(() => {
		const { hash } = window.location;
		if (hash === '#_=_' || hash === '#_') {
			// Strip the fragment without reloading the page
			window.history.replaceState(
				null,
				document.title,
				window.location.pathname + window.location.search
			);
		}
	}, []);

	return (
		<html lang="en" style={htmlDefault}>
			<Head />
			<body style={bodyDefault}>
				<Navbar />
				<main style={mainDefault}>
					<h1
						style={headingStyle}
					>
						Welcome to Citra Example
					</h1>
					<p
						style={paragraphStyle}
					>
						Citra is a lightweight TypeScript OAuth2 client library
						that makes it easy to authorize users, refresh, and
						revoke tokens with just a few lines of code.
					</p>

					<nav
						style={{
							alignItems: 'center',
							display: 'flex',
							flexDirection: 'column',
							gap: '10px'
						}}
					>
						<button
							style={buttonStyle({
								backgroundColor: '#4285F4',
								color: 'white'
							})}
							onClick={() => setAuthModalOpen(true)}
						>
							Test OAuth2
						</button>

						<button
							style={buttonStyle({
								backgroundColor: '#4285F4',
								color: 'white'
							})}
							onClick={() => setRefreshModalOpen(true)}
						>
							Refresh Token
						</button>

						<button
							style={buttonStyle({
								backgroundColor: '#4285F4',
								color: 'white'
							})}
							onClick={() => setRevokeModalOpen(true)}
						>
							Revoke Token
						</button>

						<button
							style={buttonStyle({
								backgroundColor: '#4285F4',
								color: 'white'
							})}
							onClick={() => setProfileModalOpen(true)}
						>
							Fetch Profile
						</button>
					</nav>
					<ToastProvider>
						{authModalOpen === true && (
							<AuthorizeModal
								authModalOpen={authModalOpen}
								setAuthModalOpen={setAuthModalOpen}
							/>
						)}

						{refreshModalOpen === true && (
							<RefreshModal
								refreshModalOpen={refreshModalOpen}
								setRefreshModalOpen={setRefreshModalOpen}
							/>
						)}
						{revokeModalOpen === true && (
							<RevokeModal
								revokeModalOpen={revokeModalOpen}
								setRevokeModalOpen={setRevokeModalOpen}
							/>
						)}
						{profileModalOpen === true && (
							<FetchProfileModal
								profileModalOpen={profileModalOpen}
								setProfileModalOpen={setProfileModalOpen}
							/>
						)}
					</ToastProvider>
				</main>
			</body>
		</html>
	);
};
