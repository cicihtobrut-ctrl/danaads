import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Kode yang benar: memiliki 'async' DAN penutup '</script>' */}
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
