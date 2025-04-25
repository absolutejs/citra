import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';

type RefreshTokenProps = {
	setRefreshModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const RefreshToken = ({ setRefreshModalOpen }: RefreshTokenProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [refreshToken, setRefreshToken] = useState<string>('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/tokens`,
			{
				method: 'POST',
				body: new URLSearchParams({
					refresh_token: refreshToken
				})
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
			<ProviderDropdown setCurrentProvider={setCurrentProvider} />

			<input
				type="text"
				name="refresh_token"
				placeholder="Enter refresh token"
				value={refreshToken}
				onChange={(event) => setRefreshToken(event.target.value)}
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
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
