import { Dispatch, SetStateAction } from 'react';

type ProviderDropdownProps<T extends string> = {
  providerOptions: T[];
  setCurrentProvider: Dispatch<SetStateAction<T | undefined>>;
};

export function ProviderDropdown<T extends string>({
  providerOptions,
  setCurrentProvider,
}: ProviderDropdownProps<T>) {
  return (
    <select
      defaultValue={-1}
      onChange={(e) => {
        const idx = Number(e.target.value);
        if (idx < 0) {
          setCurrentProvider(undefined);
        } else {
          setCurrentProvider(providerOptions[idx]);
        }
      }}
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        padding: '8px',
      }}
    >
      <option value={-1}>Select provider</option>
      {providerOptions.map((provider, i) => (
        <option key={provider} value={i}>
          {provider}
        </option>
      ))}
    </select>
  );
}
