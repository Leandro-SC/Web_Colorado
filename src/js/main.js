import { menuMovil } from "./modules/menuMovil.js";
import { activeNav } from "./modules/activeNav.js";
import { sliderHero } from "./modules/sliderHero.js";
import { lazyLoadImages } from "./modules/lazyLoadImages.js";
import { sliderHeroBanner } from "./modules/sliderHeroBanner.js";
import { revealOnScroll } from "./modules/revealOnScroll.js";
import { sliderServices } from "./modules/sliderServices.js";

document.addEventListener("DOMContentLoaded", () => {
  menuMovil();
  activeNav();

  lazyLoadImages();
  sliderHero();

  sliderHeroBanner();
  revealOnScroll();

  sliderServices();
});
