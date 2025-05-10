import {
	googleButtonStyle,
	googleButtonContentStyle,
	googleIconStyle,
	googleButtonTextStyle
} from '../../styles/authStyles';

type OAuthButtonsProps = {
	mode: 'login' | 'signup';
};

export const OAuthButtons = ({ mode }: OAuthButtonsProps) => (
	<a href="/authorize/google" style={googleButtonStyle}>
		<div style={googleButtonContentStyle}>
			<img
				src="/assets/svg/GoogleIcon.svg"
				alt="Google Icon"
				style={googleIconStyle}
			/>
			<span style={googleButtonTextStyle}>
				{mode === 'login'
					? 'Sign in with Google'
					: 'Sign up with Google'}
			</span>
		</div>
	</a>
);
