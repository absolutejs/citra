import { Dispatch, SetStateAction } from 'react';

type ProviderDropdownProps<T extends string> = {
	providerOptions: T[];
	setCurrentProvider: Dispatch<SetStateAction<T | undefined>>;
};

export const ProviderDropdown = <T extends string>({
	providerOptions,
	setCurrentProvider
}: ProviderDropdownProps<T>) => (
	<select
		defaultValue={-1}
		onChange={(event) => {
			const index = parseInt(event.target.value);

			if (index < 0) {
				setCurrentProvider(undefined);
			} else {
				setCurrentProvider(providerOptions[index]);
			}
		}}
		style={{
			border: '1px solid #ccc',
			borderRadius: '4px',
			fontSize: '14px',
			padding: '8px'
		}}
	>
		<option value={-1}>Select provider</option>
		{providerOptions.map((provider, index) => (
			<option key={provider} value={index}>
				{provider}
			</option>
		))}
	</select>
);
