import { useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';

export const RevokeToken = () => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [tokenToRevoke, setTokenToRevoke] = useState<string>('');

	return (
		<form style={formStyle}>
			<ProviderDropdown setCurrentProvider={setCurrentProvider} />

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
				formAction={`oauth2/${currentProvider?.toLowerCase()}/revocation`}
				disabled={!currentProvider || !tokenToRevoke}
				formMethod="post"
				type="submit"
				style={formButtonStyle(
					currentProvider !== undefined && tokenToRevoke !== undefined
				)}
			>
				Revoke Token
			</button>

			<button
				type="submit"
				formAction={`/oauth2/${currentProvider?.toLowerCase()}/authorization-revocation`}
				disabled={!currentProvider}
				formMethod="get"
				style={formButtonStyle(currentProvider !== undefined)}
			>
				Authorize and Revoke Token
			</button>
		</form>
	);
};
