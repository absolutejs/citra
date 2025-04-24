import { useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';

export const RefreshToken = () => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [refreshToken, setRefreshToken] = useState<string>('');

	return (
		<form style={formStyle}>
			<ProviderDropdown setCurrentProvider={setCurrentProvider} />

			<input
				type="text"
				name="refresh_token"
				placeholder="Enter refresh token"
				value={refreshToken}
				onChange={(e) => setRefreshToken(e.target.value)}
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
				}}
			/>

			<button
				type="submit"
				formAction={`oauth2/${currentProvider?.toLowerCase()}/tokens`}
				disabled={!currentProvider || !refreshToken}
				formMethod="post"
				style={formButtonStyle(
					currentProvider !== undefined && refreshToken !== undefined
				)}
			>
				Refresh Token
			</button>

			<button
				type="submit"
				formAction={`/oauth2/${currentProvider?.toLowerCase()}/authorization-tokens`}
				disabled={!currentProvider}
				formMethod="get"
				style={formButtonStyle(currentProvider !== undefined)}
			>
				Authorize and Refresh Token
			</button>
		</form>
	);
};
