import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Script Wajib dari Telegram Mini App */}
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        
        {/* Script SDK Rewarded Ad dari Monetag */}
        <script src='//libtl.com/sdk.js' data-zone='9933536' data-sdk='show_9933536' async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

