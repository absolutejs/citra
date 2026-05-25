import { Dispatch, SetStateAction, useState, FormEvent } from 'react';
import { refreshableProviderOptions } from '../../../src/providerOptions';
import { RefreshableProvider } from '../../../src/types';
import { formStyle, formButtonStyle } from '../../styles/styles';
import { Modal } from '../utils/Modal';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { useToast } from '../utils/ToastProvider';

type RefreshModalProps = {
	refreshModalOpen: boolean;
	setRefreshModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const RefreshModal = ({
	refreshModalOpen,
	setRefreshModalOpen
}: RefreshModalProps) => {
	const [currentProvider, setCurrentProvider] =
		useState<RefreshableProvider>();
	const [refreshToken, setRefreshToken] = useState<string>('');
	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Refreshing token, please wait...'
		});

		const response = await fetch(
			`oauth2/${currentProvider?.toLowerCase()}/tokens`,
			{
				body: new URLSearchParams({
					refresh_token: refreshToken
				}),
				method: 'POST'
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
			message: 'Token refreshed successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
	};

	const { registerHost } = useToast();

	return (
		<Modal
			isOpen={refreshModalOpen}
			onClose={() => {
				setRefreshModalOpen(false);
				registerHost(null);
			}}
			onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
		>
			<form onSubmit={handleSubmit} style={formStyle}>
				<ProviderDropdown
					providerOptions={refreshableProviderOptions}
					setCurrentProvider={setCurrentProvider}
				/>

				<input
					name="refresh_token"
					onChange={(event) => setRefreshToken(event.target.value)}
					placeholder="Enter refresh token"
					style={{
						border: '1px solid #ccc',
						borderRadius: '4px',
						fontSize: '14px',
						padding: '8px'
					}}
					type="text"
					value={refreshToken}
				/>

				<button
					disabled={!currentProvider || !refreshToken}
					style={formButtonStyle(
						currentProvider !== undefined && refreshToken !== ''
					)}
					type="submit"
				>
					Refresh Token
				</button>
			</form>
		</Modal>
	);
};
