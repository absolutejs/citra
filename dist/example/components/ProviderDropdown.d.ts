import { Dispatch, SetStateAction } from 'react';
type ProviderDropdownProps<T extends string> = {
    providerOptions: T[];
    setCurrentProvider: Dispatch<SetStateAction<T | undefined>>;
};
export declare const ProviderDropdown: <T extends string>({ providerOptions, setCurrentProvider }: ProviderDropdownProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
