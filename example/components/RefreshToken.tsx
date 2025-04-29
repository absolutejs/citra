import { FormEvent, useState } from 'react';
import { providers } from '../../src/providers';
import { isRefreshableProvider } from '../../src/typeGuards';
import { RefreshableProvider } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { useToast } from './Toast';

const refreshableProviders = Object.keys(providers).filter(
	isRefreshableProvider
);

export const RefreshToken = () => {
	const [currentProvider, setCurrentProvider] =
		useState<RefreshableProvider>();
	const [refreshToken, setRefreshToken] = useState<string>('');
	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Refreshing token, please wait...'
		});

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/tokens`,
			{
				body: new URLSearchParams({
					refresh_token: refreshToken
				}),
				method: 'POST'
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			addToast({
				message: `${errorText}`,
				style: { background: '#f8d7da', color: '#721c24' },
				duration: 0
			});

			return;
		}
		addToast({
			message: 'Token refreshed successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
	};

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				providerOptions={refreshableProviders}
			/>

			<input
				type="text"
				name="refresh_token"
				placeholder="Enter refresh token"
				value={refreshToken}
				onChange={(event) => setRefreshToken(event.target.value)}
				style={{
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px',
					padding: '8px'
				}}
			/>

			<button
				type="submit"
				disabled={!currentProvider || !refreshToken}
				style={formButtonStyle(
					currentProvider !== undefined && refreshToken !== ''
				)}
			>
				Refresh Token
			</button>
		</form>
	);
};
