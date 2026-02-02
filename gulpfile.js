import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import plumber from 'gulp-plumber'


const sass = gulpSass(dartSass)

import terser from 'gulp-terser'
import sharp from 'sharp'

/* ================================
   JavaScript
================================ */
export function js(done) {
    src('src/js/main.js', { allowEmpty: true })
        .pipe(plumber())
        .pipe(terser())
        .pipe(dest('build/js'))

    done()
}

/* ================================
   SCSS
================================ */
export function css(done) {
    src('src/scss/app.scss', { sourcemaps: true, allowEmpty: true })
        .pipe(plumber())
        .pipe(
            sass({ outputStyle: 'compressed' })
                .on('error', sass.logError)
        )
        .pipe(dest('build/css', { sourcemaps: '.' }))

    done()
}

/* ================================
   Crop thumbnails (gallery)
================================ */
export async function crop(done) {
    const inputFolder = 'src/images/raw'
    const outputFolder = 'src/images/thumb'
    const width = 250
    const height = 180

    
    if (!fs.existsSync(inputFolder)) {
        done()
        return
    }

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    const images = fs
        .readdirSync(inputFolder)
        .filter(file => /\.(jpg)$/i.test(path.extname(file)))

    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)

            sharp(inputFile)
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        })

        done()
    } catch (error) {
        console.log(error)
    }
}

/* ================================
   Images: JPG, WebP, AVIF
================================ */
export async function imagenes(done) {
    const srcDir = './src/images'
    const buildDir = './build/img'
    const images = await glob('./src/images/**/*.{jpg,png}')

    if (images.length === 0) {
        done()
        return
    }

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file))
        const outputSubDir = path.join(buildDir, relativePath)
        procesarImagenes(file, outputSubDir)
    })

    done()
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }

    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)

    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }

    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

/* ================================
   Watch / Dev
================================ */
export function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    watch('src/images/**/*.{png,jpg}', imagenes)
}

/* ================================
   Default
================================ */
export default series(crop, js, css, imagenes, dev)
