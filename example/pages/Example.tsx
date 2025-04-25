import { Navbar } from '../components/Navbar';
import {
	htmlDefault,
	bodyDefault,
	mainDefault,
	buttonStyle
} from '../utils/styles';

import { useEffect, useState } from 'react';
import { Head } from '../components/Head';
import { Authorize } from '../components/Authorize';
import { Modal } from '../components/Modal';
import { RefreshToken } from '../components/RefreshToken';
import { RevokeToken } from '../components/RevokeToken';
import { FetchProfile } from '../components/FetchProfile';

export const Example = () => {
	const [authModalOpen, setAuthauthModalOpen] = useState(false);
	const [refreshModalOpen, setRefreshModalOpen] = useState(false);
	const [revokeModalOpen, setRevokeModalOpen] = useState(false);
	const [profileModalOpen, setProfileModalOpen] = useState(false);

	// This is a fix for the Facebook OAuth2 flow to remove the hash
	// fragment from the URL after the redirect.
	useEffect(() => {
		if (window.location.hash === '#_=_') {
		  // Remove the fragment without reloading
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
						style={{
							fontSize: '2.5rem',
							marginBottom: '20px',
							color: '#333',
							textAlign: 'center'
						}}
					>
						Welcome to Citra Example
					</h1>
					<p
						style={{
							fontSize: '1.2rem',
							marginBottom: '20px',
							color: '#333',
							lineHeight: '1.5',
							maxWidth: '600px',
							textAlign: 'center'
						}}
					>
						Citra is a lightweight TypeScript OAuth2 client library
						that makes it easy to authorize users, refresh, and
						revoke tokens with just a few lines of code.
					</p>

					<nav
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px'
						}}
					>
						<button
							style={buttonStyle({
								backgroundColor: '#4285F4',
								color: 'white'
							})}
							onClick={() => setAuthauthModalOpen(true)}
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
					{authModalOpen && (
						<Modal
							isOpen={authModalOpen}
							onClose={() => setAuthauthModalOpen(false)}
						>
							<Authorize />
						</Modal>
					)}

					{refreshModalOpen && (
						<Modal
							isOpen={refreshModalOpen}
							onClose={() => setRefreshModalOpen(false)}
						>
							<RefreshToken
								setRefreshModalOpen={setRefreshModalOpen}
							/>
						</Modal>
					)}
					{revokeModalOpen && (
						<Modal
							isOpen={revokeModalOpen}
							onClose={() => setRevokeModalOpen(false)}
						>
							<RevokeToken
								setRevokeModalOpen={setRevokeModalOpen}
							/>
						</Modal>
					)}
					{profileModalOpen && (
						<Modal
							isOpen={profileModalOpen}
							onClose={() => setProfileModalOpen(false)}
						>
							<FetchProfile
								setProfileModalOpen={setProfileModalOpen}
							/>
						</Modal>
					)}
				</main>
			</body>
		</html>
	);
};
