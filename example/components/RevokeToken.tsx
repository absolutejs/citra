import { FormEvent, useState } from 'react';
import { providers } from '../../src/providers';
import { isRevocableProvider } from '../../src/typeGuards';
import { RevocableProvider } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { useToast } from './Toast';

const revocableProviders = Object.keys(providers).filter(isRevocableProvider);

export const RevokeToken = () => {
	const [currentProvider, setCurrentProvider] = useState<RevocableProvider>();
	const [tokenToRevoke, setTokenToRevoke] = useState<string>('');

	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Revoking token, please wait...'
		});

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/revocation?token_to_revoke=${tokenToRevoke}`,
			{
				method: 'DELETE'
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
			message: 'Token revoked successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
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
