import { Dispatch, SetStateAction, useState } from 'react';
import { providerOptions } from '../../../src/providers';
import { ProviderOption } from '../../../src/types';
import { formStyle, formButtonStyle } from '../../styles/styles';
import { Modal } from '../utils/Modal';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { useToast } from '../utils/ToastProvider';

type AuthModalProps = {
	authModalOpen: boolean;
	setAuthModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const AuthorizeModal = ({
	authModalOpen,
	setAuthModalOpen
}: AuthModalProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const { registerHost } = useToast();

	return (
		<Modal
			isOpen={authModalOpen}
			onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
			onClose={() => {
				setAuthModalOpen(false);
				registerHost(null);
			}}
		>
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
