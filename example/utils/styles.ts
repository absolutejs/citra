import { CSSProperties } from 'react';
import { ProviderOption } from '../../src/types';

export const styleReset = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-weight: inherit;
    }
`;

export const bodyDefault: CSSProperties = {
	fontFamily: 'Poppins, sans-serif',
	backgroundColor: '#f5f5f5',
	color: '#333',
	height: '100%',
	margin: 0,
	display: 'flex',
	flexDirection: 'column'
};

export const mainDefault: CSSProperties = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center'
};

export const htmlDefault: CSSProperties = {
	height: '100%'
};

type ButtonStyleProps = {
	backgroundColor?: string;
	color?: string;
	width?: string;
};
export const buttonStyle = ({
	backgroundColor = 'none',
	color = 'white',
	width
}: ButtonStyleProps): CSSProperties => ({
	display: 'flex',
	alignItems: 'center',
	textDecoration: 'none',
	justifyContent: 'center',
	padding: '0.625rem 1rem',
	margin: '0.3125rem',
	border: 'none',
	borderRadius: '0.3125rem',
	color,
	width,
	backgroundColor,
	cursor: 'pointer',
	fontSize: '1rem',
	fontWeight: 'bold',
	textWrap: 'nowrap'
});

export const formStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	padding: '16px',
	width: '300px'
};

export const formButtonStyle = (isFullOpacity?: boolean): CSSProperties => ({
	padding: '8px 16px',
	backgroundColor: '#007bff',
	color: '#fff',
	border: 'none',
	borderRadius: '4px',
	fontSize: '14px',
	cursor: isFullOpacity ? 'pointer' : 'not-allowed',
	opacity: isFullOpacity ? 1 : 0.5
});
