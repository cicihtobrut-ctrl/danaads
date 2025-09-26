import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Script Wajib dari Telegram Mini App */}
<<<<<<< HEAD
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
=======
<script src="https://telegram.org/js/telegram-web-app.js" async></scr>

>>>>>>> f65e04b (fix: add async attribute to telegram script)
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

