import { providers } from '../../src/providers';
import { formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

export const RefreshToken = () => {
	return (
		<form style={formStyle}>
			<ProviderDropdown />

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
				Refresh Token
			</button>

			<a href="/">Authorize and Refresh Token</a>
		</form>
	);
};
