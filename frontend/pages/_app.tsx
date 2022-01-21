import "@fontsource/roboto/400.css";
import { AppProps } from "next/app";
import Layout from "../components/Layout";
import MyStore from "../store";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MyStore>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MyStore>
    </>
  );
}

export default App;
