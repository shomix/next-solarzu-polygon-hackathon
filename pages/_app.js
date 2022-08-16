import '../styles/globals.css'
import Layout from '../components/layout'
function MyApp({ Component, pageProps }) {
  return (
    <Layout className="back">
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp;