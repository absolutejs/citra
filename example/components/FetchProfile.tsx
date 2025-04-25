import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { providers } from '../../src/providers';
import { ProviderOption } from '../../src/types';

type FetchProfileProps = {
	setProfileModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const FetchProfile = ({ setProfileModalOpen }: FetchProfileProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [accessToken, setAccessToken] = useState<string>('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

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
			alert(`Error: ${errorText}`);
			return;
		}
		setProfileModalOpen(false);
		alert('Profile fetched successfully!');
	};

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				providerOptions={Object.keys(providers)}
			/>

			<input
				type="text"
				name="access_token"
				placeholder="Enter access token"
				value={accessToken}
				onChange={(event) => setAccessToken(event.target.value)}
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
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
