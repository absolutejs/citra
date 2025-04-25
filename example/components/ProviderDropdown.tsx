import { Dispatch, SetStateAction } from 'react';
import { isValidProviderOption } from '../../src/typeGuards';

type ProviderDropdownProps = {
	providerOptions: string[];
	setCurrentProvider: Dispatch<SetStateAction<any | undefined>>;
};

export const ProviderDropdown = ({
	providerOptions,
	setCurrentProvider
}: ProviderDropdownProps) => {
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
			{providerOptions.map((provider) => (
				<option key={provider} value={provider}>
					{provider}
				</option>
			))}
		</select>
	);
};
