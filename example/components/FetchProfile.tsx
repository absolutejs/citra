import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { providers } from '../../src/providers';
import { isValidProviderOption } from '../../src/typeGuards';
import { ProviderOption } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

type FetchProfileProps = {
	setProfileModalOpen: Dispatch<SetStateAction<boolean>>;
};

const providerOptions = Object.keys(providers).filter(isValidProviderOption);

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
			alert(`${errorText}`);

			return;
		}
		setProfileModalOpen(false);
		alert('Profile fetched successfully!');
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
