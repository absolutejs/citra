import { CSSProperties } from 'react';
import { HALF } from './constants';

export const styleReset = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-weight: inherit;
    }
`;

export const bodyDefault: CSSProperties = {
	backgroundColor: '#f5f5f5',
	color: '#333',
	display: 'flex',
	flexDirection: 'column',
	fontFamily: 'Poppins, sans-serif',
	height: '100%',
	margin: 0
};

export const mainDefault: CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	justifyContent: 'center'
};

export const htmlDefault: CSSProperties = {
	height: '100%'
};

type ButtonStyleProps = {
	backgroundColor?: string;
	color?: string;
};
export const buttonStyle = ({
	backgroundColor = 'none',
	color = 'white'
}: ButtonStyleProps): CSSProperties => ({
	alignItems: 'center',
	backgroundColor,
	border: 'none',
	borderRadius: '0.3125rem',
	color,
	cursor: 'pointer',
	display: 'flex',
	fontSize: '1rem',
	fontWeight: 'bold',
	justifyContent: 'center',
	margin: '0.3125rem',
	padding: '0.625rem 1rem',
	textDecoration: 'none',
	textWrap: 'nowrap',
	width: '100%'
});

export const formStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	padding: '16px',
	width: '300px'
};

export const formButtonStyle = (isFullOpacity?: boolean): CSSProperties => ({
	backgroundColor: '#007bff',
	border: 'none',
	borderRadius: '4px',
	color: '#fff',
	cursor: isFullOpacity ? 'pointer' : 'not-allowed',
	fontSize: '14px',
	opacity: isFullOpacity ? 1 : HALF,
	padding: '8px 16px'
});

export const headingStyle: CSSProperties = {
	color: '#333',
	fontSize: '2.5rem',
	marginBottom: '20px',
	textAlign: 'center'
}

export const paragraphStyle: CSSProperties = {
	color: '#333',
	fontSize: '1.2rem',
	lineHeight: '1.5',
	marginBottom: '20px',
	maxWidth: '600px',
	textAlign: 'center'
}