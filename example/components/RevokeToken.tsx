import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { providers } from '../../src/providers';
import { isRevocableProvider } from '../../src/typeGuards';
import { RevocableProvider } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

type RevokeTokenProps = {
	setRevokeModalOpen: Dispatch<SetStateAction<boolean>>;
};

const revocableProviders = Object.keys(providers).filter(isRevocableProvider);

export const RevokeToken = ({ setRevokeModalOpen }: RevokeTokenProps) => {
	const [currentProvider, setCurrentProvider] = useState<RevocableProvider>();
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
			alert(`${errorText}`);

			return;
		}
		setRevokeModalOpen(false);
		alert('Token revoked successfully!');
	};

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				providerOptions={revocableProviders}
			/>

			<input
				type="text"
				name="token"
				value={tokenToRevoke}
				onChange={(event) => setTokenToRevoke(event.target.value)}
				placeholder="Enter token to revoke"
				style={{
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px',
					padding: '8px'
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
