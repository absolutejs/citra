import { Dispatch, SetStateAction, useState, FormEvent } from 'react';
import { revocableProviderOptions } from '../../../src/providerOptions';
import { RevocableProvider } from '../../../src/types';
import { formButtonStyle, formStyle } from '../../styles/styles';
import { Modal } from '../utils/Modal';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { useToast } from '../utils/ToastProvider';

type RevokeModalProps = {
	revokeModalOpen: boolean;
	setRevokeModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const RevokeModal = ({
	revokeModalOpen,
	setRevokeModalOpen
}: RevokeModalProps) => {
	const [currentProvider, setCurrentProvider] = useState<RevocableProvider>();
	const [tokenToRevoke, setTokenToRevoke] = useState<string>('');

	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Revoking token, please wait...'
		});

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/revocation?token_to_revoke=${tokenToRevoke}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			addToast({
				duration: 0,
				message: `${errorText}`,
				style: { background: '#f8d7da', color: '#721c24' }
			});

			return;
		}
		addToast({
			message: 'Token revoked successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
	};

	const { registerHost } = useToast();

	return (
		<Modal
			isOpen={revokeModalOpen}
			onClose={() => {
				setRevokeModalOpen(false);
				registerHost(null);
			}}
			onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
		>
			<form onSubmit={handleSubmit} style={formStyle}>
				<ProviderDropdown
					providerOptions={revocableProviderOptions}
					setCurrentProvider={setCurrentProvider}
				/>

				<input
					name="token"
					onChange={(event) => setTokenToRevoke(event.target.value)}
					placeholder="Enter token to revoke"
					style={{
						border: '1px solid #ccc',
						borderRadius: '4px',
						fontSize: '14px',
						padding: '8px'
					}}
					type="text"
					value={tokenToRevoke}
				/>

				<button
					disabled={!currentProvider || !tokenToRevoke}
					style={formButtonStyle(
						currentProvider !== undefined && tokenToRevoke !== ''
					)}
					type="submit"
				>
					Revoke Token
				</button>
			</form>
		</Modal>
	);
};
