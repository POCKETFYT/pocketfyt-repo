import HomepageHero from "../HomepageHero";

export default function HomepageHeroExample() {
  return (
    <HomepageHero onGetStarted={() => console.log("Get Started clicked")} />
  );
}
