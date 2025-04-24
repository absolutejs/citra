import { Dispatch, SetStateAction } from 'react';
import { providers } from '../../src/providers';
import { ProviderOption } from '../../src/types';
import { isValidProviderOption } from '../../src/typeGuards';

type ProviderDropdownProps = {
	setCurrentProvider: Dispatch<SetStateAction<ProviderOption | undefined>>;
};

export const ProviderDropdown = ({
	setCurrentProvider
}: ProviderDropdownProps) => {
	const providerNames = Object.keys(providers);

	return (
		<select
			defaultValue=""
			onChange={(event) => {
				if (event.target.value === '') {
					setCurrentProvider(undefined);
				}

				if (isValidProviderOption(event.target.value)) {
					setCurrentProvider(event.target.value);
				}
			}}
			style={{
				padding: '8px',
				border: '1px solid #ccc',
				borderRadius: '4px',
				fontSize: '14px'
			}}
		>
			<option value="">Select provider</option>
			{providerNames.map((provider) => (
				<option key={provider} value={provider}>
					{provider}
				</option>
			))}
		</select>
	);
};
