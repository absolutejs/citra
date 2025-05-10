import { Elysia } from 'elysia';
import { User } from '../db/schema';
import { sessionStore } from './sessionStore';

export const statusPlugin = new Elysia()
	.use(sessionStore<User>())
	.get(
		'/auth-status',
		async ({
			error,
			cookie: { user_session_id, auth_provider },
			store: { session }
		}) => {
			if (user_session_id === undefined || auth_provider === undefined) {
				return error('Bad Request', 'Missing Cookies');
			}

			try {
				if (user_session_id.value === undefined) {
					return new Response(
						JSON.stringify({ isLoggedIn: false, user: null }),
						{
							headers: { 'Content-Type': 'application/json' }
						}
					);
				}

				if (auth_provider.value === undefined) {
					return new Response(
						JSON.stringify({ isLoggedIn: false, user: null }),
						{
							headers: { 'Content-Type': 'application/json' }
						}
					);
				}

				const userSession = session[user_session_id.value];

				// Return null because the user is not logged in, its not an error just a status
				if (userSession === undefined) {
					return new Response(
						JSON.stringify({ isLoggedIn: false, user: null }),
						{
							headers: { 'Content-Type': 'application/json' }
						}
					);
				}

				const { user } = userSession;

				return new Response(
					JSON.stringify({ isLoggedIn: true, user }),
					{
						headers: { 'Content-Type': 'application/json' }
					}
				);
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Error: ${err.message} - ${err.stack ?? ''}`
					);
				}

				return error('Internal Server Error', `Unknown Error: ${err}`);
			}
		}
	);
