import { useState } from 'react';
import { formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';

export const Authorize = () => {
	const [currentProvider, setCurrentProvider] = useState<string>();

	return (
		<form
			action={`/authorize/${currentProvider}`}
			method="get"
			style={formStyle}
		>
			<ProviderDropdown setCurrentProvider={setCurrentProvider} />

			<button
				type="submit"
				disabled={!currentProvider}
				style={{
					padding: '8px 16px',
					backgroundColor: '#007bff',
					color: '#fff',
					border: 'none',
					borderRadius: '4px',
					fontSize: '14px',
					cursor: currentProvider ? 'pointer' : 'not-allowed',
					opacity: currentProvider ? 1 : 0.5
				}}
			>
				Authorize
			</button>
		</form>
	);
};
