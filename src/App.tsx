import HeroImage from "./components/Hero";
import Layout from "./components/Layout";
import IntroLoader from "./components/IntroLoader";

function App() {
  return (
    <IntroLoader>
      <Layout>
        <HeroImage />
      </Layout>
    </IntroLoader>
  );
}

export default App;
