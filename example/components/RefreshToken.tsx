import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { providers } from '../../src/providers';
import { isRefreshableProvider } from '../../src/typeGuards';
import { RefreshableProvider } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

type RefreshTokenProps = {
	setRefreshModalOpen: Dispatch<SetStateAction<boolean>>;
};

const refreshableProviders = Object.keys(providers).filter(
	isRefreshableProvider
);

export const RefreshToken = ({ setRefreshModalOpen }: RefreshTokenProps) => {
	const [currentProvider, setCurrentProvider] =
		useState<RefreshableProvider>();
	const [refreshToken, setRefreshToken] = useState<string>('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

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
			alert(`Error: ${errorText}`);

			return;
		}
		setRefreshModalOpen(false);
		alert('Token refreshed successfully!');
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
