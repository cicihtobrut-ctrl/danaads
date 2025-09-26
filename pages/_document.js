import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        <script src='//libtl.com/sdk.js' data-zone='9933536' data-sdk='show_9933536' async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

