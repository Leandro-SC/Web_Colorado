import { menuMovil } from "./modules/menuMovil.js";
import { activeNav } from "./modules/activeNav.js";
import { sliderHero } from "./modules/sliderHero.js";
import { lazyLoadImages } from "./modules/lazyLoadImages.js";
import { sliderHeroBanner } from "./modules/sliderHeroBanner.js";
import { revealOnScroll } from "./modules/revealOnScroll.js";
import { sliderServices } from "./modules/sliderServices.js";
import { footerEnhancements } from "./modules/footer.js";
import { crearGaleria } from "./modules/crearGaleria.js";
import { servicesPage } from './modules/servicesPage.js';
import { faq } from './modules/faq.js';
import { filtrosProyectos, lightboxProyectos } from './modules/projects.js';


document.addEventListener("DOMContentLoaded", () => {
  menuMovil();
  activeNav();

  lazyLoadImages();
  sliderHero();

  sliderHeroBanner();
  revealOnScroll();

  sliderServices();
  footerEnhancements();
  crearGaleria();

  servicesPage();
  faq();

  filtrosProyectos();
  lightboxProyectos();

});
