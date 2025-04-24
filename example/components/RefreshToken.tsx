import { useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';

export const RefreshToken = () => {
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

			<button
				type="submit"
				style={formButtonStyle(currentProvider)}
			>
				Refresh Token
			</button>

			<a href="/">Authorize and Refresh Token</a>
		</form>
	);
};
