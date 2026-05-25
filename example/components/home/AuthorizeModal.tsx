import { Dispatch, SetStateAction, useState } from 'react';
import { providerOptions } from '../../../src/providerOptions';
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
			onClose={() => {
				setAuthModalOpen(false);
				registerHost(null);
			}}
			onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
		>
			<form
				action={`/oauth2/${currentProvider?.toLowerCase()}/authorization`}
				method="get"
				style={formStyle}
			>
				<ProviderDropdown
					providerOptions={providerOptions}
					setCurrentProvider={setCurrentProvider}
				/>

				<button
					disabled={!currentProvider}
					style={formButtonStyle(currentProvider !== undefined)}
					type="submit"
				>
					Authorize
				</button>
			</form>
		</Modal>
	);
};
