import '@fontsource/roboto/400.css';
import { AppProps } from 'next/app';
import { Children } from 'react';
import MyStore from '../store';



function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MyStore>
        <Component {...pageProps} />
      </MyStore>
    </>)
}

export default App