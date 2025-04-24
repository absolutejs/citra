import { useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';

export const RevokeToken = () => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();

	return (
		<form style={formStyle}>
			<ProviderDropdown setCurrentProvider={setCurrentProvider} />

			<input
				type="text"
				placeholder="Enter your token"
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
				}}
			/>

			<button type="submit" style={formButtonStyle(currentProvider)}>
				Revoke Token
			</button>

			<a href="/">Authorize and Revoke Token</a>
		</form>
	);
};
