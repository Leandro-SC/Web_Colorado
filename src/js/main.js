import { navegacionFija } from "./modules/navegacionFija.js";
import { scrollNav } from "./modules/scrollNav.js";
import { menuMovil } from "./modules/menuMovil.js";

export function crearGaleria() {}
export function sliderHero() {}
export function filtrosProyectos() {}
export function lazyLoadImages() {}

document.addEventListener("DOMContentLoaded", () => {
  navegacionFija();
  scrollNav();
  menuMovil();
});
