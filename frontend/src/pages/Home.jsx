import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Departaments from "../components/Departaments";
import Advantages from "../components/Advantages";
import FooterCm from "../components/Footer";

const Home = () => {
  return (
    <>
      <Hero title={"Bienvenido a MEDE LINK-CARE "} imageURL={"/hero.png"} />
      <Biography imageURL={"/about.jpg"} />
      <Departaments />
      <Advantages />
      <FooterCm />
    </>
  );
};

export default Home;
