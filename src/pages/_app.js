// src/pages/_app.js
import "../app/globals.css"; // Ensure you are importing global styles here

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
