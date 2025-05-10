import { CSSProperties } from 'react';

export const confirmInputStyle: CSSProperties = {
	border: '1px solid #ccc',
	borderRadius: '4px',
	marginBottom: '20px',
	padding: '10px',
	width: '100%'
};
export const containerStyle: CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	justifyContent: 'center',
	margin: '0 auto',
	minWidth: '400px',
	padding: '20px'
};
export const egLogoStyle: CSSProperties = {
	height: '100px',
	margin: '0 auto'
};
export const googleButtonContentStyle: CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	justifyContent: 'center',
	paddingLeft: '12px',
	paddingRight: '12px',
	width: '100%'
};
export const googleButtonStyle: CSSProperties = {
	alignItems: 'center',
	backgroundColor: '#FFFFFF',
	border: '1px solid #747775',
	borderRadius: '4px',
	color: '#1f1f1f',
	cursor: 'pointer',
	display: 'flex',
	fontSize: '14px',
	justifyContent: 'center',
	marginBottom: '10px',
	padding: '10px',
	textDecoration: 'none',
	width: '100%'
};
export const googleButtonTextStyle: CSSProperties = {
	overflow: 'hidden',
	textAlign: 'center',
	textOverflow: 'ellipsis'
};
export const googleIconStyle: CSSProperties = {
	height: '20px',
	marginRight: '10px',
	width: '20px'
};
export const headingStyle: CSSProperties = {
	fontSize: '1.5rem',
	marginBottom: '20px',
	textAlign: 'center'
};
export const inputStyle: CSSProperties = {
	border: '1px solid #ccc',
	borderRadius: '4px',
	marginBottom: '10px',
	padding: '10px 0 10px 0',
	width: '100%'
};
export const labelStyle: CSSProperties = {
	color: '#333',
	fontSize: '14px',
	marginBottom: '-2px',
	textAlign: 'left'
};
export const loginContainerStyle: CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	gap: '5px',
	justifyContent: 'center',
	marginTop: '20px'
};
export const loginLinkTextStyle: CSSProperties = {
	color: '#C7158C',
	cursor: 'pointer',
	textAlign: 'center'
};
export const loginTextStyle: CSSProperties = {
	color: '#151414',
	textAlign: 'center'
};
export const nameInputContainerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	width: '100%'
};
export const nameRowStyle: CSSProperties = {
	display: 'flex',
	gap: '10px',
	justifyContent: 'space-between'
};
export const separatorStyle: CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	justifyContent: 'center',
	margin: '20px 0',
	width: '100%'
};
export const separatorTextStyle: CSSProperties = {
	color: '#747775',
	fontSize: '14px',
	padding: '0 10px'
};
export const signupButtonStyle: CSSProperties = {
	alignItems: 'center',
	backgroundColor: '#C7158C',
	border: 'none',
	borderRadius: '4px',
	color: '#fff',
	cursor: 'pointer',
	display: 'flex',
	fontSize: '14px',
	fontWeight: 'bold',
	justifyContent: 'center',
	padding: '10px',
	width: '100%'
};
export const separatorLineStyle = ({
	color = '#DDDDDD',
	height = '1px'
} = {}): CSSProperties => ({
	backgroundColor: color,
	flexGrow: 1,
	height: height
});
