import path from "path";
import fs from "fs";
import { glob } from "glob";
import { src, dest, watch, series, parallel } from "gulp";

import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import plumber from "gulp-plumber";

import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import terser from "gulp-terser";

import fileInclude from "gulp-file-include";
import { deleteAsync } from "del";

import esbuild from "gulp-esbuild";
import sourcemaps from "gulp-sourcemaps";



import sharp from "sharp";

const sass = gulpSass(dartSass);

/* ================================
   Rutas base
================================ */
const paths = {
  html: {
    pages: "src/html/*.html",
    watch: ["src/html/**/*.html"],
    dest: "build",
  },
  scss: {
    entry: "src/scss/app.scss",
    watch: "src/scss/**/*.scss",
    dest: "build/css",
  },
  js: {
    entry: "src/js/main.js",
    watch: "src/js/**/*.js",
    dest: "build/js",
  },
  images: {
    // Solo procesamos "raw" como fuente productiva (como tu estructura exige)
    src: "src/images/raw/**/*.{jpg,jpeg,png}",
    rawBase: "src/images/raw",
    dest: "build/img",
    thumbsDest: "build/img/thumb",
  },
};

/* ================================
   Limpieza build (recomendado)
================================ */
export function clean() {
  return deleteAsync(["build/**", "!build"]);
}


/* ================================
   HTML: ensamblado con parciales
   - src/html/*.html puede incluir parciales desde src/html/partials/
   - salida final a build/*.html
================================ */
export function html() {
  return src(paths.html.pages, { allowEmpty: true })
    .pipe(plumber())
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "src/html", // permite @@include('partials/header.html')
        context: {},
      })
    )
    .pipe(dest(paths.html.dest));
}

/* ================================
   SCSS: dart-sass + autoprefixer + cssnano + sourcemaps
================================ */
export function css() {
  return src(paths.scss.entry, { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded", // primero expandido para postcss más estable
      }).on("error", sass.logError)
    )
    .pipe(postcss([autoprefixer(), cssnano()])) // minificado real
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scss.dest));
}

/* ================================
   JavaScript: terser + sourcemaps
================================ */
export function js() {
  return src("src/js/main.js", { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      esbuild({
        bundle: true,
        minify: true,
        sourcemap: true,
        target: "es2018",
        format: "iife",
        outfile: "app.js",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/js"));
}


/* ================================
   Thumbnails: crop / resize (gallery)
   - Fuente: src/images/raw
   - Salida: build/img/thumb
   - Respeta estructura relativa
================================ */
export async function cropThumbs() {
  const images = await glob(paths.images.src);

  if (images.length === 0) return;

  const width = 250;
  const height = 180;

  await Promise.all(
    images.map(async (file) => {
      const relDir = path.relative(paths.images.rawBase, path.dirname(file));
      const outDir = path.join(paths.images.thumbsDest, relDir);

      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      // thumbnails siempre JPG para consistencia y performance
      const baseName = path.basename(file, path.extname(file));
      const outFile = path.join(outDir, `${baseName}.jpg`);

      await sharp(file)
        .resize(width, height, { fit: "cover", position: "center" })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(outFile);
    })
  );
}

/* ================================
   Imágenes: JPG optimizado + WebP 50 + AVIF 50
   - Fuente: src/images/raw
   - Salida: build/img (misma estructura relativa)
================================ */
export async function imagenes() {
  const images = await glob(paths.images.src);

  if (images.length === 0) return;

  await Promise.all(
    images.map(async (file) => {
      const relDir = path.relative(paths.images.rawBase, path.dirname(file));
      const outDir = path.join(paths.images.dest, relDir);

      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      const baseName = path.basename(file, path.extname(file));

      const outJpg = path.join(outDir, `${baseName}.jpg`);
      const outWebp = path.join(outDir, `${baseName}.webp`);
      const outAvif = path.join(outDir, `${baseName}.avif`);

      // JPG optimizado (fallback)
      const img = sharp(file);

      await img
        .clone()
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(outJpg);

      // WebP y AVIF a 50% como pediste
      await img.clone().webp({ quality: 50 }).toFile(outWebp);
      await img.clone().avif({ quality: 50 }).toFile(outAvif);
    })
  );
}

/* ================================
   Watch / Dev
================================ */
export function dev() {
  watch(paths.html.watch, html);
  watch(paths.scss.watch, css);
  watch(paths.js.watch, js);
  watch(paths.images.src, series(cropThumbs, imagenes));
}

/* ================================
   Build (sin watch)
================================ */
export const build = series(clean, parallel(html, css, js), parallel(cropThumbs, imagenes));

/* ================================
   Default: build + watch
================================ */
export default series(clean, parallel(html, css, js), parallel(cropThumbs, imagenes), dev);
