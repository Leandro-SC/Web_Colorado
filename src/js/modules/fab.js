export function initFloatingActions() {
  const root = document.querySelector(".fab");
  if (!root) return;

  const topBtn = root.querySelector("[data-back-to-top]");
  const langBtn = root.querySelector("[data-lang-toggle]");
  const langLabel = root.querySelector(".fab__lang");
  const flagEl = root.querySelector(".fab__flag"); // en tu HTML existe
  // en vez de root.querySelector(...)
  const langToggles = document.querySelectorAll("[data-lang-toggle]");
  langToggles.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // importante si es <a>
    const current = window.i18next.language || "en";
    const next = current === "en" ? "es" : "en";
    window.i18next.changeLanguage(next);
  });
});



  // -------------------------------
  // Back to top visibility
  // -------------------------------
  const onScroll = () => {
    const show = window.scrollY > 500;
    root.classList.toggle("is-top-visible", show);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -------------------------------
  // i18n (i18next)
  // -------------------------------
  if (typeof window.i18next === "undefined") {
    if (langBtn) langBtn.style.display = "none";
    return;
  }

  // ✅ TU resources AQUÍ
  const resources = {
    en: {
      translation: {
        // NAV
        "nav.home": "Home",
        "nav.about": "About",
        "nav.projects": "Projects",
        "nav.services": "Services",
        "nav.contact": "Contact",

        // GLOBAL CTA
        "cta.primary": "Get a Free Estimate",
        "cta.secondary": "View Projects",

        // CONTACT
        "contact.eyebrow": "Colorado Service Area",
        "contact.title": "Let’s Build Your Next Outdoor Project",
        "contact.lead":
          "Share your idea, timeline, and a few photos. We’ll respond with clear next steps and a fast estimate.",
        "contact.form.title": "Get a Fast Estimate",
        "contact.form.lead":
          "Tell us what you want to build. Add photos if possible — it helps us quote faster.",
        "contact.form.btn": "Request estimate",
        "contact.map.title": "Service Area",
        "contact.map.lead": "We serve projects across Colorado. Reach out to confirm your area.",

        // FORM
        "form.name.label": "Full name",
        "form.name.ph": "Your name",
        "form.phone.label": "Phone",
        "form.phone.ph": "(xxx) xxx xxxx",
        "form.email.label": "Email",
        "form.email.ph": "you@email.com",
        "form.service.label": "Service",
        "form.timeline.label": "Timeline",
        "form.message.label": "Project details",
        "form.message.ph":
          "Tell us what you want to build, approximate size, materials, and any notes.",

        // FAB (label muestra el idioma al que cambiarás)
        "fab.lang": "ES",
        "fab.top": "Back to top",
        "fab.wa": "Chat on WhatsApp",

        // BRAND / HEADER / ARIA
        "brand.name": "Colorado Pro Masonry LLC",
        "brand.short": "Colorado Pro Masonry",
        "header.quote": "Get a Quote",
        "header.mobile.meta": "Fast quotes • Clean installs",
        "header.mobile.book": "Book an Appointment",
        "header.mobile.call": "Call now",
        "header.mobile.work": "View work",
        "header.mobile.note": "Licensed craftsmanship built for long-term durability.",
        "aria.go_home": "Go to homepage",
        "aria.open_menu": "Open menu",
        "aria.close_menu": "Close menu",

        // HOME (anidado)
        home: {
          hero: {
            title: "Colorado Pro Masonry",
            subtitle: "Colorado’ Choice for Timeless Stone Design",
            cta_secondary: "Book an Appointment",
            dots_aria: "Choose slide",
            prev_aria: "Previous slide",
            next_aria: "Next slide",
            slide1_alt: "Premium stone patio",
            slide2_alt: "Retaining wall installation",
            slide3_alt: "Outdoor living stonework"
          },
          trust: {
            badge: "Trusted workmanship",
            title: "Built with a clean process and durable materials.",
            subtitle:
              "We focus on structural prep, drainage, and finish details so your project looks premium and performs for years.",
            item1: {
              title: "Licensed & insured",
              text: "Clear scope, safe worksite, and accountability from start to finish."
            },
            item2: {
              title: "Fast quotes",
              text: "Share photos and measurements. We reply quickly with a clear estimate."
            },
            item3: {
              title: "Premium craftsmanship",
              text: "Tight lines, stable base prep, and a finish designed for long-term durability."
            },
            img1_alt: "Outdoor stone patio with clean layout and premium finish",
            img2_alt: "Stone walkway with precise joints",
            img3_alt: "Retaining wall with structured stone layout"
          },
          services: {
            title: "Outdoor masonry services\nbuilt for durability.",
            lead: "Premium stone and masonry work designed for curb appeal, performance, and clean finishes.",
            prev_aria: "Previous services",
            next_aria: "Next services",
            dots_aria: "Service slides",
            view_all: "View all services",
            view_all_aria: "View all services",
            cards: {
              stoneWork: {
                badge: "Stone Work",
                desc: "Natural stone installations crafted with precision, clean joints, and long-term durability.",
                alt: "Natural stone masonry work",
                aria: "Stone Work service"
              },
              thinBrick: {
                badge: "Thin Brick",
                desc: "Lightweight brick systems that deliver a classic look with modern performance.",
                alt: "Thin brick masonry finish",
                aria: "Thin Brick service"
              },
              flagstone: {
                badge: "Flagstone",
                desc: "Premium flagstone layouts for patios, walkways, and outdoor transitions.",
                alt: "Flagstone patio installation",
                aria: "Flagstone service"
              },
              outdoorKitchens: {
                badge: "Outdoor Kitchens",
                desc: "Built-in outdoor kitchens designed for everyday use and entertaining.",
                alt: "Outdoor kitchen stone construction",
                aria: "Outdoor Kitchens service"
              },
              firePits: {
                badge: "Fire Pits",
                desc: "Custom fire pits with safe clearances and premium stone finishes.",
                alt: "Stone fire pit installation",
                aria: "Fire Pits service"
              },
              fireplaces: {
                badge: "Fireplaces",
                desc: "Statement fireplaces designed as architectural focal points.",
                alt: "Stone fireplace construction",
                aria: "Fireplaces service"
              },
              stoneWalls: {
                badge: "Stone Walls",
                desc: "Decorative stone walls that add depth, texture, and visual impact.",
                alt: "Decorative stone wall feature",
                aria: "Decorative Stone Walls service"
              },
              repairs: {
                badge: "Masonry Repairs",
                desc: "Structural repairs and refinishing to restore safety and appearance.",
                alt: "Masonry repair work",
                aria: "Masonry Repairs service"
              },
              custom: {
                badge: "Custom Projects",
                desc: "Tailored outdoor masonry projects built around your space and vision.",
                alt: "Custom outdoor masonry project",
                aria: "Custom Outdoor Projects service"
              }
            }
          },
          process: {
            eyebrow: "Our process",
            title: "A simple flow that delivers premium results.",
            subtitle: "Clear steps, consistent communication, and craftsmanship-focused execution.",
            step1: {
              title: "Quick consult",
              text: "Share photos, measurements, and goals. We confirm feasibility and key site details."
            },
            step2: {
              title: "Scope & estimate",
              text: "We define materials, layout, timeline, and cost—so you know exactly what to expect."
            },
            step3: {
              title: "Build & finish",
              text: "Base prep, drainage, precise installation, and detail finishing for long-term performance."
            },
            step4: {
              title: "Final walk-through",
              text: "We review details, clean the jobsite, and share care guidance to protect your investment."
            },
            img_alt: "Outdoor stonework project with clean lines and premium finish",
            caption_title: "Built for durability",
            caption_text: "Premium materials, clean install, and lasting performance."
          },
          projects: {
  title: "Featured Projects",
  lead: "A curated selection of premium outdoor masonry work. Tap any photo to preview, then explore the full gallery.",
  quick: "Quick view",
  more: "See full portfolio (60+)",
  more_aria: "View all projects",

  item1: { /* ya lo tienes */ },

  item2: {
    badge: "Retaining Wall",
    name: "Retaining Wall",
    text: "Structured leveling with strong lines and long-term stability.",
    alt: "Retaining wall build",
    open_aria: "Open Retaining Wall preview"
  },
  item3: {
    badge: "Outdoor Living",
    name: "Outdoor Living",
    text: "Outdoor spaces designed for everyday use and hosting.",
    alt: "Outdoor living stonework",
    open_aria: "Open Outdoor Living preview"
  },
  item4: {
    badge: "Outdoor Kitchen",
    name: "Outdoor Kitchen",
    text: "Built-in kitchen stonework with clean geometry and detail finishing.",
    alt: "Outdoor kitchen masonry project",
    open_aria: "Open Outdoor Kitchen preview"
  },
  item5: {
    badge: "Flagstone",
    name: "Flagstone Walkway",
    text: "Comfortable transitions with premium stone patterns.",
    alt: "Flagstone walkway project",
    open_aria: "Open Flagstone Walkway preview"
  },
  item6: {
    badge: "Fire Pit",
    name: "Fire Pit",
    text: "A warm focal point with premium stone finish and safe clearances.",
    alt: "Fire pit stone installation",
    open_aria: "Open Fire Pit preview"
  },
  item7: {
    badge: "Stone Wall",
    name: "Stone Feature Wall",
    text: "Texture and depth with clean alignment and durable install.",
    alt: "Stone wall project",
    open_aria: "Open Stone Feature Wall preview"
  },
  item8: {
    badge: "Outdoor Steps",
    name: "Outdoor Steps",
    text: "Safe steps with clean edges and consistent risers.",
    alt: "Outdoor steps masonry project",
    open_aria: "Open Outdoor Steps preview"
  },
  item9: {
    badge: "Patio Expansion",
    name: "Patio Expansion",
    text: "More usable space with a seamless stone extension.",
    alt: "Patio expansion stonework",
    open_aria: "Open Patio Expansion preview"
  },
  item10: {
    badge: "Edging",
    name: "Stone Edging",
    text: "Clean borders and transitions that elevate the final look.",
    alt: "Stone edging and bordering",
    open_aria: "Open Stone Edging preview"
  },
  item11: {
    badge: "Fireplace",
    name: "Outdoor Fireplace",
    text: "Architectural focal point with premium stone texture.",
    alt: "Outdoor fireplace masonry build",
    open_aria: "Open Outdoor Fireplace preview"
  },
  item12: {
    badge: "Detail Finish",
    name: "Masonry Detail",
    text: "Close-up detail work that defines a premium finish.",
    alt: "Masonry detail and finishing",
    open_aria: "Open Masonry Detail preview"
  }
}
,
          lightbox: {
            aria: "Project preview",
            close_aria: "Close preview",
            prev: "Prev",
            next: "Next",
            prev_aria: "Previous project",
            next_aria: "Next project"
          },
          projectsTeaser: {
            tile: {
              2: {
                title: "Retaining Wall",
                caption: "Structured leveling with strong lines and long-term stability.",
                badge: "Retaining Wall",
                quick: "Quick view",
                aria: "Open Retaining Wall preview"
              },
              3: {
                title: "Outdoor Living",
                caption: "Outdoor spaces designed for everyday use and hosting.",
                badge: "Outdoor Living",
                quick: "Quick view",
                aria: "Open Outdoor Living preview"
              },
              4: {
                title: "Outdoor Kitchen",
                caption: "Built-in kitchen stonework with clean geometry and detail finishing.",
                badge: "Outdoor Kitchen",
                quick: "Quick view",
                aria: "Open Outdoor Kitchen preview"
              },
              5: {
                title: "Flagstone Walkway",
                caption: "Comfortable transitions with premium stone patterns.",
                badge: "Flagstone",
                quick: "Quick view",
                aria: "Open Flagstone Walkway preview"
              },
              6: {
                title: "Fire Pit",
                caption: "A warm focal point with premium stone finish and safe clearances.",
                badge: "Fire Pit",
                quick: "Quick view",
                aria: "Open Fire Pit preview"
              },
              7: {
                title: "Stone Feature Wall",
                caption: "Texture and depth with clean alignment and durable install.",
                badge: "Stone Wall",
                quick: "Quick view",
                aria: "Open Stone Feature Wall preview"
              },
              8: {
                title: "Outdoor Steps",
                caption: "Safe steps with clean edges and consistent risers.",
                badge: "Outdoor Steps",
                quick: "Quick view",
                aria: "Open Outdoor Steps preview"
              },
              9: {
                title: "Patio Expansion",
                caption: "More usable space with a seamless stone extension.",
                badge: "Patio Expansion",
                quick: "Quick view",
                aria: "Open Patio Expansion preview"
              },
              10: {
                title: "Stone Edging",
                caption: "Clean borders and transitions that elevate the final look.",
                badge: "Edging",
                quick: "Quick view",
                aria: "Open Stone Edging preview"
              },
              11: {
                title: "Outdoor Fireplace",
                caption: "Architectural focal point with premium stone texture.",
                badge: "Fireplace",
                quick: "Quick view",
                aria: "Open Outdoor Fireplace preview"
              },
              12: {
                title: "Masonry Detail",
                caption: "Close-up detail work that defines a premium finish.",
                badge: "Detail Finish",
                quick: "Quick view",
                aria: "Open Masonry Detail preview"
              }
            }
          }
        },

        // FOOTER (anidado)
        footer: {
          brand: {
            home_aria: "Go home",
            logo_alt: "Colorado Pro Masonry LLC logo",
            lead:
              "Premium stone and concrete work built with clean craftsmanship, reliable materials, and long-term durability."
          },
          contact: {
            phone_aria: "Call (501) 812 0003",
            phone_label: "Phone",
            estimate_aria: "Request a quote",
            estimate_label: "Estimate",
            estimate_value: "Request a quote"
          },
          cols: {
            company: { title: "Company" },
            getstarted: {
              title: "Get started",
              free_estimate: "Free estimate",
              see_portfolio: "See portfolio",
              service_list: "Service list",
              privacy_policy: "Privacy policy"
            }
          },
          cta: {
            title: "Fast quote",
            text: "Send a short description and photos. We’ll reply with a clear estimate and next steps."
          },
          bottom: {
            copy: "© {{year}} Colorado Pro Masonry LLC. All rights reserved.",
            privacy: "Privacy",
            contact: "Contact"
          },
          social: {
            facebook_aria: "Facebook",
            instagram_aria: "Instagram",
            x_aria: "X"
          }
        },

        // FAB (atributos aria/title)
        fab: {
          top_aria: "Back to top",
          top_title: "Back to top",
          wa_aria: "Chat on WhatsApp",
          wa_title: "WhatsApp",
          lang_aria: "Change language",
          lang_title: "ES / EN"
        }
      }
    },

    es: {
      translation: {
        // NAV
        "nav.home": "Inicio",
        "nav.about": "Nosotros",
        "nav.projects": "Proyectos",
        "nav.services": "Servicios",
        "nav.contact": "Contacto",

        // GLOBAL CTA
        "cta.primary": "Solicitar cotización",
        "cta.secondary": "Ver proyectos",

        // CONTACT
        "contact.eyebrow": "Área de servicio en Colorado",
        "contact.title": "Construyamos tu próximo proyecto exterior",
        "contact.lead":
          "Cuéntanos tu idea, tu plazo y agrega fotos. Te responderemos con próximos pasos y una cotización rápida.",
        "contact.form.title": "Obtén una cotización rápida",
        "contact.form.lead":
          "Cuéntanos qué deseas construir. Agrega fotos si puedes: nos ayuda a cotizar más rápido.",
        "contact.form.btn": "Solicitar cotización",
        "contact.map.title": "Área de servicio",
        "contact.map.lead": "Atendemos proyectos en todo Colorado. Escríbenos para confirmar tu zona.",

        // FORM
        "form.name.label": "Nombre completo",
        "form.name.ph": "Tu nombre",
        "form.phone.label": "Teléfono",
        "form.phone.ph": "(xxx) xxx xxxx",
        "form.email.label": "Correo",
        "form.email.ph": "tu@email.com",
        "form.service.label": "Servicio",
        "form.timeline.label": "Plazo",
        "form.message.label": "Detalles del proyecto",
        "form.message.ph":
          "Cuéntanos qué deseas construir, tamaño aproximado, materiales y notas.",

        // FAB (label muestra el idioma al que cambiarás)
        "fab.lang": "EN",
        "fab.top": "Volver arriba",
        "fab.wa": "WhatsApp",

        // BRAND / HEADER / ARIA
        "brand.name": "Colorado Pro Masonry LLC",
        "brand.short": "Colorado Pro Masonry",
        "header.quote": "Cotizar ahora",
        "header.mobile.meta": "Cotizaciones rápidas • Instalación impecable",
        "header.mobile.book": "Agendar una cita",
        "header.mobile.call": "Llamar ahora",
        "header.mobile.work": "Ver trabajos",
        "header.mobile.note": "Trabajo certificado, con durabilidad a largo plazo.",
        "aria.go_home": "Ir al inicio",
        "aria.open_menu": "Abrir menú",
        "aria.close_menu": "Cerrar menú",

        home: {
          hero: {
            title: "Colorado Pro Masonry",
            subtitle: "La elección de Colorado para diseño en piedra atemporal",
            cta_secondary: "Agendar una cita",
            dots_aria: "Elegir diapositiva",
            prev_aria: "Diapositiva anterior",
            next_aria: "Siguiente diapositiva",
            slide1_alt: "Patio premium de piedra",
            slide2_alt: "Instalación de muro de contención",
            slide3_alt: "Piedra para área social exterior"
          },
          trust: {
            badge: "Trabajo confiable",
            title: "Construido con un proceso limpio y materiales durables.",
            subtitle:
              "Nos enfocamos en base estructural, drenaje y detalles finales para que tu proyecto se vea premium y dure por años.",
            item1: { title: "Licenciados y asegurados", text: "Alcance claro, obra segura y responsabilidad de inicio a fin." },
            item2: { title: "Cotizaciones rápidas", text: "Comparte fotos y medidas. Respondemos rápido con una estimación clara." },
            item3: { title: "Artesanía premium", text: "Líneas precisas, base estable y un acabado diseñado para durar." },
            img1_alt: "Patio exterior de piedra con diseño limpio y acabado premium",
            img2_alt: "Camino de piedra con juntas precisas",
            img3_alt: "Muro de contención con patrón estructurado"
          },
          services: {
            title: "Servicios de masonry exterior\nhechos para durar.",
            lead: "Trabajo premium en piedra y masonry diseñado para estética, desempeño y acabados limpios.",
            prev_aria: "Servicios anteriores",
            next_aria: "Siguientes servicios",
            dots_aria: "Diapositivas de servicios",
            view_all: "Ver todos los servicios",
            view_all_aria: "Ver todos los servicios",
            cards: {
              stoneWork: {
                badge: "Trabajo en piedra",
                desc: "Instalaciones en piedra natural con precisión, juntas limpias y durabilidad a largo plazo.",
                alt: "Trabajo de masonry en piedra natural",
                aria: "Servicio de trabajo en piedra"
              },
              thinBrick: {
                badge: "Ladrillo delgado",
                desc: "Sistemas ligeros que logran un look clásico con rendimiento moderno.",
                alt: "Acabado de ladrillo delgado",
                aria: "Servicio de ladrillo delgado"
              },
              flagstone: {
                badge: "Laja (flagstone)",
                desc: "Diseños premium en laja para patios, senderos y transiciones exteriores.",
                alt: "Instalación de patio en laja",
                aria: "Servicio de laja"
              },
              outdoorKitchens: {
                badge: "Cocinas exteriores",
                desc: "Cocinas integradas para uso diario y reuniones, con terminación premium.",
                alt: "Construcción de cocina exterior en piedra",
                aria: "Servicio de cocinas exteriores"
              },
              firePits: {
                badge: "Fogateros",
                desc: "Fogateros a medida con distancias seguras y acabados premium en piedra.",
                alt: "Instalación de fogatero en piedra",
                aria: "Servicio de fogateros"
              },
              fireplaces: {
                badge: "Chimeneas",
                desc: "Chimeneas protagonistas diseñadas como punto focal arquitectónico.",
                alt: "Construcción de chimenea en piedra",
                aria: "Servicio de chimeneas"
              },
              stoneWalls: {
                badge: "Muros de piedra",
                desc: "Muros decorativos que aportan textura, profundidad e impacto visual.",
                alt: "Muro decorativo de piedra",
                aria: "Servicio de muros decorativos"
              },
              repairs: {
                badge: "Reparaciones",
                desc: "Reparaciones estructurales y acabados para recuperar seguridad y estética.",
                alt: "Trabajo de reparación en masonry",
                aria: "Servicio de reparaciones"
              },
              custom: {
                badge: "Proyectos a medida",
                desc: "Proyectos exteriores personalizados según tu espacio y visión.",
                alt: "Proyecto exterior personalizado en masonry",
                aria: "Servicio de proyectos personalizados"
              }
            }
          },
          process: {
            eyebrow: "Nuestro proceso",
            title: "Un flujo simple que entrega resultados premium.",
            subtitle: "Pasos claros, comunicación constante y ejecución enfocada en la calidad.",
            step1: { title: "Consulta rápida", text: "Comparte fotos, medidas y objetivos. Confirmamos viabilidad y detalles del sitio." },
            step2: { title: "Alcance y cotización", text: "Definimos materiales, diseño, tiempo y costo para que sepas qué esperar." },
            step3: { title: "Construcción y acabado", text: "Base, drenaje, instalación precisa y detalles finales para rendimiento duradero." },
            step4: { title: "Revisión final", text: "Revisamos el trabajo, dejamos el área limpia y compartimos recomendaciones de cuidado." },
            img_alt: "Proyecto de piedra exterior con líneas limpias y acabado premium",
            caption_title: "Hecho para durar",
            caption_text: "Materiales premium, instalación limpia y desempeño a largo plazo."
          },
          projects: {
  title: "Proyectos destacados",
  lead: "Una selección curada de trabajos premium. Toca una foto para previsualizar y luego explora la galería completa.",
  quick: "Vista rápida",
  more: "Ver portafolio completo (60+)",
  more_aria: "Ver todos los proyectos",

  item1: { /* ya lo tienes */ },

  item2: {
    badge: "Muro de contención",
    name: "Muro de contención",
    text: "Nivelación estructurada con líneas firmes y estabilidad a largo plazo.",
    alt: "Construcción de muro de contención",
    open_aria: "Abrir vista previa de Muro de contención"
  },
  item3: {
    badge: "Área social exterior",
    name: "Área social exterior",
    text: "Espacios exteriores pensados para uso diario y reuniones.",
    alt: "Piedra en área social exterior",
    open_aria: "Abrir vista previa de Área social exterior"
  },
  item4: {
    badge: "Cocina exterior",
    name: "Cocina exterior",
    text: "Trabajo en piedra para cocina integrada con geometría limpia y detalle final.",
    alt: "Proyecto de cocina exterior en masonry",
    open_aria: "Abrir vista previa de Cocina exterior"
  },
  item5: {
    badge: "Laja (flagstone)",
    name: "Sendero en laja",
    text: "Transiciones cómodas con patrones premium en piedra.",
    alt: "Proyecto de sendero en laja",
    open_aria: "Abrir vista previa de Sendero en laja"
  },
  item6: {
    badge: "Fogatero",
    name: "Fogatero",
    text: "Punto focal cálido con acabado premium y distancias seguras.",
    alt: "Instalación de fogatero en piedra",
    open_aria: "Abrir vista previa de Fogatero"
  },
  item7: {
    badge: "Muro de piedra",
    name: "Muro decorativo",
    text: "Textura y profundidad con alineación limpia e instalación durable.",
    alt: "Proyecto de muro de piedra",
    open_aria: "Abrir vista previa de Muro decorativo"
  },
  item8: {
    badge: "Escaleras exteriores",
    name: "Escaleras exteriores",
    text: "Escaleras seguras con bordes limpios y alturas consistentes.",
    alt: "Proyecto de escaleras exteriores",
    open_aria: "Abrir vista previa de Escaleras exteriores"
  },
  item9: {
    badge: "Ampliación de patio",
    name: "Ampliación de patio",
    text: "Más espacio usable con una extensión de piedra integrada.",
    alt: "Ampliación de patio en piedra",
    open_aria: "Abrir vista previa de Ampliación de patio"
  },
  item10: {
    badge: "Bordes",
    name: "Bordes de piedra",
    text: "Bordes limpios y transiciones que elevan el acabado final.",
    alt: "Bordes y delimitación en piedra",
    open_aria: "Abrir vista previa de Bordes de piedra"
  },
  item11: {
    badge: "Chimenea",
    name: "Chimenea exterior",
    text: "Punto focal arquitectónico con textura premium en piedra.",
    alt: "Construcción de chimenea exterior",
    open_aria: "Abrir vista previa de Chimenea exterior"
  },
  item12: {
    badge: "Acabado",
    name: "Detalle en masonry",
    text: "Detalle en primer plano que define un acabado premium.",
    alt: "Detalle y acabado en masonry",
    open_aria: "Abrir vista previa de Detalle en masonry"
  }
}
,
          lightbox: {
            aria: "Vista previa del proyecto",
            close_aria: "Cerrar vista previa",
            prev: "Anterior",
            next: "Siguiente",
            prev_aria: "Proyecto anterior",
            next_aria: "Siguiente proyecto"
          }
        },

        footer: {
          brand: {
            home_aria: "Ir al inicio",
            logo_alt: "Logo de Colorado Pro Masonry LLC",
            lead:
              "Trabajos premium en piedra y concreto, con instalación limpia, materiales confiables y durabilidad a largo plazo."
          },
          contact: {
            phone_aria: "Llamar al (501) 812 0003",
            phone_label: "Teléfono",
            estimate_aria: "Solicitar cotización",
            estimate_label: "Cotización",
            estimate_value: "Solicitar cotización"
          },
          cols: {
            company: { title: "Empresa" },
            getstarted: {
              title: "Empezar",
              free_estimate: "Cotización gratis",
              see_portfolio: "Ver portafolio",
              service_list: "Lista de servicios",
              privacy_policy: "Política de privacidad"
            }
          },
          cta: {
            title: "Cotización rápida",
            text: "Envíanos una breve descripción y fotos. Te responderemos con una estimación clara y los siguientes pasos."
          },
          bottom: {
            copy: "© {{year}} Colorado Pro Masonry LLC. Todos los derechos reservados.",
            privacy: "Privacidad",
            contact: "Contacto"
          },
          social: {
            facebook_aria: "Facebook",
            instagram_aria: "Instagram",
            x_aria: "X"
          }
        },

        fab: {
          top_aria: "Volver arriba",
          top_title: "Volver arriba",
          wa_aria: "Chatear por WhatsApp",
          wa_title: "WhatsApp",
          lang_aria: "Cambiar idioma",
          lang_title: "ES / EN"
        }
      }
    }
  };


  function applyTranslations() {
    // data-i18n => textContent (ojo: si el elemento contiene <br>, NO uses data-i18n ahí)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      // Evita romper nodos con <br> dentro
      if (el.querySelector("br")) return;

      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.textContent = val;
    });

    // data-i18n-html => innerHTML (para casos con <br>)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.innerHTML = val;
    });

    // placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("placeholder", val);
    });

    // aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("aria-label", val);
    });

    // title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("title", val);
    });

    // alt
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("alt", val);
    });

    // html lang
    document.documentElement.lang = window.i18next.language === "es" ? "es" : "en";

    // FAB label: muestra el idioma al que cambiarás
    if (langLabel) langLabel.textContent = window.i18next.t("fab.lang", { defaultValue: "" });

    // flag
    if (flagEl) flagEl.textContent = window.i18next.language === "es" ? "🇺🇸" : "🇲🇽";

    // year (tu footer usa data-year)
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  const saved = localStorage.getItem("site_lang") || "en";

  window.i18next.init(
    {
      lng: saved,
      fallbackLng: "en",
      resources,
      interpolation: { escapeValue: false }
    },
    () => {
      applyTranslations();
      console.log("[i18n] ready:", window.i18next.language);
    }
  );

  window.i18next.on("languageChanged", (lng) => {
    localStorage.setItem("site_lang", lng);
    applyTranslations();
    console.log("[i18n] changed:", lng);
  });

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const current = window.i18next.language || "en";
      const next = current === "en" ? "es" : "en";
      window.i18next.changeLanguage(next);
    });
  }

  
}
