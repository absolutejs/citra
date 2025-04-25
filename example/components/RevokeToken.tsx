import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';
import { providers } from '../../src/providers';

type RevokeTokenProps = {
	setRevokeModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const RevokeToken = ({ setRevokeModalOpen }: RevokeTokenProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [tokenToRevoke, setTokenToRevoke] = useState<string>('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/revocation?token_to_revoke=${tokenToRevoke}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			alert(`Error: ${errorText}`);
			return;
		}
		setRevokeModalOpen(false);
		alert('Token revoked successfully!');
	};

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<ProviderDropdown setCurrentProvider={setCurrentProvider} providerOptions={Object.keys(providers)} />

			<input
				type="text"
				name="token"
				value={tokenToRevoke}
				onChange={(e) => setTokenToRevoke(e.target.value)}
				placeholder="Enter token to revoke"
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
				}}
			/>

			<button
				disabled={!currentProvider || !tokenToRevoke}
				type="submit"
				style={formButtonStyle(
					currentProvider !== undefined && tokenToRevoke !== ''
				)}
			>
				Revoke Token
			</button>
		</form>
	);
};
