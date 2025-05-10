import { CSSProperties } from 'react';

export const legendWrapperStyle: CSSProperties = {
	backgroundColor: '#fff',
	border: '1px solid #ddd',
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	margin: '0 auto 2rem',
	maxWidth: '800px',
	padding: '20px',
	width: '100%'
};

export const legendTitleStyle: CSSProperties = {
	fontSize: '1.25rem',
	fontWeight: 600,
	margin: '0 0 16px',
	textAlign: 'center'
};

export const legendGridStyle: CSSProperties = {
	alignItems: 'center',
	columnGap: '12px',
	display: 'grid',
	gridTemplateColumns: '8ch auto',
	margin: '0 auto',
	rowGap: '12px',
	width: 'max-content'
};

export const legendFooterStyle: CSSProperties = {
	margin: '16px 0 0',
	textAlign: 'center'
};

export const badgeStyle = (
	backgroundColor: string,
	textColor = '#fff'
): CSSProperties => ({
	alignItems: 'center',
	backgroundColor,
	border: '1px solid black',
	borderRadius: '4px',
	boxSizing: 'border-box',
	color: textColor,
	display: 'inline-flex',
	fontSize: '0.9rem',
	fontWeight: 500,
	justifyContent: 'center',
	padding: '4px 12px',
	width: '8ch'
});

export const legendTextStyle: CSSProperties = {
	fontSize: '1rem',
	lineHeight: 1.6,
	margin: 0,
	textAlign: 'left'
};
