import { Dispatch, SetStateAction, useState, FormEvent } from 'react';
import { providerOptions } from '../../../src/providerOptions';
import { ProviderOption } from '../../../src/types';
import { formStyle, formButtonStyle } from '../../styles/styles';
import { Modal } from '../utils/Modal';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { useToast } from '../utils/ToastProvider';

type FetchProfileModalProps = {
	profileModalOpen: boolean;
	setProfileModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const FetchProfileModal = ({
	profileModalOpen,
	setProfileModalOpen
}: FetchProfileModalProps) => {
	const [currentProvider, setCurrentProvider] = useState<ProviderOption>();
	const [accessToken, setAccessToken] = useState<string>('');

	const { addToast } = useToast();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		addToast({
			message: 'Fetching profile, please wait...'
		});

		const headers: Record<string, string> = {
			Authorization: `Bearer ${accessToken}`
		};

		const response = await fetch(
			`/oauth2/${currentProvider?.toLowerCase()}/profile`,
			{
				headers
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
			message: 'Fetched profile successfully!',
			style: { background: '#d4edda', color: '#155724' }
		});
	};

	const { registerHost } = useToast();

	return (
		<Modal
			isOpen={profileModalOpen} onClose={() => {
				setProfileModalOpen(false);
				registerHost(null);
			}} onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
		>
			<form onSubmit={handleSubmit} style={formStyle}>
				<ProviderDropdown
					providerOptions={providerOptions} setCurrentProvider={setCurrentProvider}
				/>

				<input
					name="access_token" onChange={(event) => setAccessToken(event.target.value)} placeholder="Enter access token" style={{
						border: '1px solid #ccc',
						borderRadius: '4px',
						fontSize: '14px',
						padding: '8px'
					}} type="text" value={accessToken}
				/>

				<button
					disabled={!currentProvider || !accessToken} style={formButtonStyle(
						currentProvider !== undefined && accessToken !== ''
					)} type="submit"
				>
					Fetch Profile
				</button>
			</form>
		</Modal>
	);
};
