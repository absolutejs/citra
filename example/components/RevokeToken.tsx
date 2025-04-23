import { providers } from '../../src/providers';

export const RevokeToken = () => {
	const providerNames = Object.keys(providers);

	return (
		<form
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				padding: '16px',
				width: '300px'
			}}
		>
			<select
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
				}}
			>
				<option value="">Select provider</option>
				{providerNames.map((provider) => (
					<option key={provider} value={provider}>
						{provider}
					</option>
				))}
			</select>

			<input
				type="text"
				placeholder="Enter your token"
				style={{
					padding: '8px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					fontSize: '14px'
				}}
			/>

			<button
				type="submit"
				style={{
					padding: '8px',
					border: 'none',
					borderRadius: '4px',
					fontSize: '14px',
					backgroundColor: '#4285F4',
					color: 'white',
					cursor: 'pointer'
				}}
			>
				Revoke Token
			</button>

			<a href="/">Authorize and Revoke Token</a>
		</form>
	);
};
