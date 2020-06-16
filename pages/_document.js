import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
	render() {
		return (
			<Html xmlns="https://www.w3.org/1999/xhtml" lang="id">
				<Head>					
					<meta charSet="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="apple-touch-icon" sizes="57x57" href="/.next/static/icons/icon_57x57.png" />
					<link rel="apple-touch-icon" sizes="60x60" href="/.next/static/icons/icon_60x60.png" />
					<link rel="apple-touch-icon" sizes="72x72" href="/.next/static/icons/icon_72x72.png" />
					<link rel="apple-touch-icon" sizes="76x76" href="/.next/static/icons/icon_76x76.png" />
					<link rel="apple-touch-icon" sizes="114x114" href="/.next/static/icons/icon_114x114.png" />
					<link rel="apple-touch-icon" sizes="120x120" href="/.next/static/icons/icon_120x120.png" />
					<link rel="apple-touch-icon" sizes="144x144" href="/.next/static/icons/icon_144x144.png" />
					<link rel="apple-touch-icon" sizes="152x152" href="/.next/static/icons/icon_152x152.png" />
					<link rel="apple-touch-icon" sizes="180x180" href="/.next/static/icons/icon_180x180.png" />
					<link rel="icon" type="image/png" sizes="192x192" href="/.next/static/icons/icon_192x192.png" />
					<link rel="icon" type="image/png" sizes="96x96" href="/.next/static/icons/icon_96x96.png" />
					<meta name="msapplication-TileColor" content="#ffffff" />
					<meta name="msapplication-TileImage" content="/.next/static/icons/icon_144x144.png" />
					<meta name="theme-color" content="#FFFFFF" />
					<link href="/static/icomoon-160320/style.css" rel="stylesheet" />
					<link href="/static/react-quill-snow.css" rel="stylesheet" />
					<script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
					{this.props.styleTags}
				</Head>
				<body className="position-relative bg-light">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
