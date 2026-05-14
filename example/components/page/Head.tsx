import { styleReset } from '../../styles/styles';

type HeadProps = {
	title?: string;
	icon?: string;
};

export const Head = ({
	title = 'Citra',
	icon = '/assets/favicon.ico'
}: HeadProps) => (
	<head>
		<meta charSet="utf-8" />
		<title>{title}</title>
		<meta content="Bun, Elysia & React" name="description" />
		<meta content="width=device-width, initial-scale=1" name="viewport" />
		<link href={icon} rel="icon" />
		<link
			href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
			rel="stylesheet"
		/>
		<style>{styleReset}</style>
	</head>
);
