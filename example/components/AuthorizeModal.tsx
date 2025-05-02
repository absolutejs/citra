import { Dispatch, SetStateAction, useState } from 'react';
import { providers } from '../../src/providers';
import { isValidProviderOption } from '../../src/typeGuards';
import { ProviderOption } from '../../src/types';
import { formButtonStyle, formStyle } from '../utils/styles';
import { Modal } from './Modal';
import { ProviderDropdown } from './ProviderDropdown';

const providerOptions = Object.keys(providers).filter(isValidProviderOption);

type AuthModalProps = {
	authModalOpen: boolean;
	setAuthModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const AuthorizeModal = ({
	authModalOpen,
	setAuthModalOpen
}: AuthModalProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();

	return (
		<Modal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}>
			<form
				action={`/oauth2/${currentProvider?.toLowerCase()}/authorization`}
				method="get"
				style={formStyle}
			>
				<ProviderDropdown
					setCurrentProvider={setCurrentProvider}
					providerOptions={providerOptions}
				/>

				<button
					type="submit"
					disabled={!currentProvider}
					style={formButtonStyle(currentProvider !== undefined)}
				>
					Authorize
				</button>
			</form>
		</Modal>
	);
};
