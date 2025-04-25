import { useState } from 'react';
import { formButtonStyle, formStyle } from '../utils/styles';
import { ProviderDropdown } from './ProviderDropdown';
import { ProviderOption } from '../../src/types';
import { providers } from '../../src/providers';

export const Authorize = () => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();

	return (
		<form
			action={`/oauth2/${currentProvider?.toLowerCase()}/authorization`}
			method="get"
			style={formStyle}
		>
			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				providerOptions={Object.keys(providers)}
			/>

			<button
				type="submit"
				disabled={!currentProvider}
				style={formButtonStyle(currentProvider !== undefined)}
			>
				Authorize
			</button>
		</form>
	);
};
