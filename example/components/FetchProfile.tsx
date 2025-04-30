import { FormEvent, useState } from 'react';
import { providers } from '../../src/providers';
import { isValidProviderOption } from '../../src/typeGuards';
import { ProviderOption } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { useToast } from './Toast';

const providerOptions = Object.keys(providers).filter(isValidProviderOption);

export const FetchProfile = () => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [accessToken, setAccessToken] = useState<string>('');

	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Fetching profile, please wait...'
		});

		const response = await fetch(
			`/oauth2/${currentProvider?.toLowerCase()}/profile`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
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
			message: 'Fetched profile successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
	};

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				providerOptions={providerOptions}
			/>

			<input
				type="text"
				name="access_token"
				placeholder="Enter access token"
				value={accessToken}
				onChange={(event) => setAccessToken(event.target.value)}
				style={{
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px',
					padding: '8px'
				}}
			/>

			<button
				type="submit"
				disabled={!currentProvider || !accessToken}
				style={formButtonStyle(
					currentProvider !== undefined && accessToken !== ''
				)}
			>
				Fetch Profile
			</button>
		</form>
	);
};
