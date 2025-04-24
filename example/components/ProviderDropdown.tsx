import { Dispatch, SetStateAction } from 'react';
import { providers } from '../../src/providers';

type ProviderDropdownProps = {
	setCurrentProvider: Dispatch<SetStateAction<string | undefined>>;
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

				setCurrentProvider(event.target.value.toLowerCase());
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
