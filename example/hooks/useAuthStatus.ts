import { useState, useEffect } from 'react';
import { User } from '../db/schema';

export const useAuthStatus = () => {
	const [user, setClient] = useState<User>();

	const checkAuthStatus = async () => {
		try {
			const response = await fetch('/auth-status');
			if (!response.ok) return;

			const data = await response.json();
			if (data.user === undefined) return;

			setClient({
				auth_sub: data.user.auth_sub ?? 'auth_sub',
				created_at: data.user.created_at ?? 'created_at',
				email: data.user.email ?? 'email',
				family_name: data.user.family_name ?? 'family_name',
				given_name: data.user.given_name ?? 'given_name',
				picture: data.user.picture ?? 'picture'
			});
		} catch (error) {
			console.error('Error checking auth status:', error);
		}
	};

	const handleSignOut = async () => {
		let response;
		try {
			response = await fetch('/logout', { method: 'POST' });
		} catch (error) {
			console.error('Error during sign out:', error);

			return;
		}

		if (response.ok) {
			setClient(undefined);
			window.location.reload();

			return;
		}

		console.error('Logout failed');
	};

	useEffect(() => {
		checkAuthStatus().catch((error) => {
			console.error('Error checking auth status:', error);
		});
	}, []);

	return {
		handleSignOut,
		user
	};
};
