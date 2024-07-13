import Feature from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import HowItWorks from "./components/Howitworks";
import Model from "./components/model";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <main className="bg-black ">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Feature />
      <HowItWorks />
      <Footer />
    </main>
  );
};

export default App;
