import { useState } from 'react';
import { formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

export const RevokeToken = () => {
	const [currentProvider, setCurrentProvider] = useState<string>();

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
				style={{
					padding: '8px',
					border: 'none',
					borderRadius: '4px',
					fontSize: '14px',
					backgroundColor: '#4285F4',
					color: 'white',
					cursor: 'pointer'
				}}
			>
				Revoke Token
			</button>

			<a href="/">Authorize and Revoke Token</a>
		</form>
	);
};
