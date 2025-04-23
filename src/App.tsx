import HeroImage from "./components/Hero";
import Layout from "./components/Layout";
import IntroLoader from "./components/IntroLoader";
import Home from "./pages/Home";

function App() {
  return (
    <IntroLoader>
      <Layout>
        <HeroImage />
        <Home />
      </Layout>
    </IntroLoader>
  );
}

export default App;
