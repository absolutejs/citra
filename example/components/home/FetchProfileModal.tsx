import { Dispatch, SetStateAction, useState, FormEvent } from 'react';
import { providers } from '../../../src/providers';
import { isValidProviderOption } from '../../../src/typeGuards';
import { ProviderOption } from '../../../src/types';
import { formStyle, formButtonStyle } from '../../styles/styles';
import { Modal } from '../utils/Modal';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { useToast } from '../utils/ToastProvider';

const providerOptions = Object.keys(providers).filter(isValidProviderOption);

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

		const response = await fetch(
			`/oauth2/${currentProvider?.toLowerCase()}/profile`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
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
			isOpen={profileModalOpen}
			onOpen={(dialogRef) => {
				registerHost(dialogRef);
			}}
			onClose={() => {
				setProfileModalOpen(false);
				registerHost(null);
			}}
		>
			<form style={formStyle} onSubmit={handleSubmit}>
				<ProviderDropdown
					setCurrentProvider={setCurrentProvider}
					providerOptions={providerOptions}
				/>

				<input
					type="text"
					name="access_token"
					placeholder="Enter access token"
					value={accessToken}
					onChange={(event) => setAccessToken(event.target.value)}
					style={{
						border: '1px solid #ccc',
						borderRadius: '4px',
						fontSize: '14px',
						padding: '8px'
					}}
				/>

				<button
					type="submit"
					disabled={!currentProvider || !accessToken}
					style={formButtonStyle(
						currentProvider !== undefined && accessToken !== ''
					)}
				>
					Fetch Profile
				</button>
			</form>
		</Modal>
	);
};
