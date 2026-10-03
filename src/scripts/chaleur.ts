/*
 * La chaleur au-dessus du feu.
 *
 * Le nom « La Fiamma » est dessiné dans une texture, à la position exacte du <h1>,
 * puis déformé par un champ de bruit qui monte, plus fort près du bas (le feu)
 * et autour du pointeur. Des braises s'élèvent. Le <h1> reste du vrai texte :
 * on ne le rend transparent que si le WebGL tourne réellement.
 */

const SOMMETS = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENTS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_texte;
uniform vec2 u_taille;
uniform float u_temps;
uniform vec2 u_pointeur;
uniform float u_energie;
uniform float u_braise;
varying vec2 v_uv;

const vec3 NUIT = vec3(0.110, 0.180, 0.231);
const vec3 NUIT_PROFONDE = vec3(0.078, 0.133, 0.173);
const vec3 PIERRE = vec3(0.894, 0.871, 0.820);
const vec3 BRAISE = vec3(0.784, 0.529, 0.227);
const vec3 BRAISE_VIVE = vec3(1.0, 0.70, 0.36);
const vec3 BRAISE_SOMBRE = vec3(0.42, 0.17, 0.07);

float hasard(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float bruit(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hasard(i), hasard(i + vec2(1.0, 0.0)), u.x),
    mix(hasard(i + vec2(0.0, 1.0)), hasard(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * bruit(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

float braises(vec2 p, float echelle, float vitesse, float graine) {
  vec2 g = p * echelle;
  g.y -= u_temps * vitesse;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hasard(id + graine);
  if (h > 0.16) return 0.0;
  vec2 o = vec2(hasard(id + graine + 1.3), hasard(id + graine + 2.7)) - 0.5;
  o *= 0.7;
  o.x += sin(u_temps * 1.3 + h * 40.0) * 0.18;
  float d = length(f - o);
  float scintille = 0.55 + 0.45 * sin(u_temps * (5.0 + h * 9.0) + h * 30.0);
  return smoothstep(0.075, 0.0, d) * scintille;
}

void main() {
  vec2 uv = v_uv;
  float ratio = u_taille.x / u_taille.y;
  vec2 p = vec2(uv.x * ratio, uv.y);
  float t = u_temps;

  // Le feu est sous la page : la chaleur monte du bas.
  float bas = pow(1.0 - uv.y, 1.7);
  float d = distance(p, vec2(u_pointeur.x * ratio, u_pointeur.y));
  float pointeur = u_energie * exp(-d * d * 14.0);
  float chaleur = (0.22 + 0.78 * bas) * u_braise + pointeur;

  vec2 q = vec2(
    fbm(p * vec2(2.2, 3.6) + vec2(0.0, -t * 0.55)),
    fbm(p * vec2(2.2, 3.6) + vec2(5.2, -t * 0.55))
  );
  vec2 decalage = (q - 0.5) * vec2(0.020, 0.030) * chaleur;
  decalage.x += sin(p.y * 42.0 - t * 3.2 + q.x * 7.0) * 0.0022 * chaleur;

  float texte = texture2D(u_texte, uv + decalage).a;

  // Nuit, plus profonde en haut, éclairée par en dessous.
  vec3 c = mix(NUIT, NUIT_PROFONDE, smoothstep(0.2, 1.0, uv.y));
  float f = fbm(vec2(p.x * 1.4, p.y * 2.4 - t * 0.32));
  float lueur = smoothstep(0.5, 0.0, uv.y + (f - 0.5) * 0.45) * u_braise;
  // Rouge sombre au loin, braise puis presque jaune au ras du feu.
  vec3 feu = mix(BRAISE_SOMBRE, BRAISE, smoothstep(0.2, 0.95, lueur) * 0.65);
  c = mix(c, feu, pow(lueur, 1.5) * 0.5);
  c += BRAISE * pointeur * 0.10;

  // Le nom, en pierre, réchauffé près du feu.
  vec3 encre = mix(PIERRE, vec3(0.98, 0.82, 0.60), bas * 0.45 * u_braise);
  c = mix(c, encre, texte);

  // Les braises naissent près du feu et s'éteignent en montant.
  float b = braises(p, 13.0, 0.5, 3.1) + braises(p, 24.0, 0.8, 8.7) * 0.65;
  c += BRAISE_VIVE * b * pow(smoothstep(0.72, 0.0, uv.y), 1.4) * u_braise;

  // Grain fin : évite les aplats en escalier dans les dégradés sombres.
  c += (hasard(uv * u_taille + fract(t) * 91.7) - 0.5) * 0.028;

  gl_FragColor = vec4(c, 1.0);
}`;

function compiler(gl: WebGLRenderingContext): WebGLProgram | null {
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[chaleur]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = shader(gl.VERTEX_SHADER, SOMMETS);
  const fs = shader(gl.FRAGMENT_SHADER, FRAGMENTS);
  if (!vs || !fs) return null;
  const programme = gl.createProgram()!;
  gl.attachShader(programme, vs);
  gl.attachShader(programme, fs);
  gl.linkProgram(programme);
  if (!gl.getProgramParameter(programme, gl.LINK_STATUS)) {
    console.warn('[chaleur]', gl.getProgramInfoLog(programme));
    return null;
  }
  return programme;
}

export function allumer(feu: HTMLElement) {
  const canvas = feu.querySelector<HTMLCanvasElement>('[data-feu-canvas]');
  const nom = feu.querySelector<HTMLElement>('[data-nom]');
  if (!canvas || !nom) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false });
  if (!gl) return;
  const programme = compiler(gl);
  if (!programme) return;
  gl.useProgram(programme);

  const tampon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(programme, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = (nomUniforme: string) => gl.getUniformLocation(programme, nomUniforme);
  const uTaille = u('u_taille');
  const uTemps = u('u_temps');
  const uPointeur = u('u_pointeur');
  const uEnergie = u('u_energie');
  const uBraise = u('u_braise');

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const toile = document.createElement('canvas');
  const ctx = toile.getContext('2d')!;
  let largeur = 0;
  let hauteur = 0;

  // Redessine le nom exactement là où le navigateur a posé le texte du <h1>.
  function preparer() {
    const cadre = feu.getBoundingClientRect();
    const grand = cadre.width * cadre.height > 1.6e6;
    const dpr = Math.min(window.devicePixelRatio || 1, grand ? 1.25 : 1.5);
    largeur = Math.round(cadre.width * dpr);
    hauteur = Math.round(cadre.height * dpr);
    canvas!.width = toile.width = largeur;
    canvas!.height = toile.height = hauteur;
    gl!.viewport(0, 0, largeur, hauteur);

    ctx.clearRect(0, 0, largeur, hauteur);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    for (const ligne of nom!.querySelectorAll<HTMLElement>('[data-ligne]')) {
      const r = ligne.getBoundingClientRect();
      const style = getComputedStyle(ligne);
      ctx.font = `${style.fontWeight} ${parseFloat(style.fontSize) * dpr}px ${style.fontFamily}`;
      const espacement = parseFloat(style.letterSpacing);
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${Number.isFinite(espacement) ? espacement * dpr : 0}px`;
      const texte = ligne.textContent ?? '';
      const m = ctx.measureText(texte);
      const ascendante = m.fontBoundingBoxAscent;
      const descendante = m.fontBoundingBoxDescent;
      // La boîte de ligne CSS centre la zone de contenu (ascendante + descendante).
      const ligneDeBase = (r.top - cadre.top) * dpr + (r.height * dpr - (ascendante + descendante)) / 2 + ascendante;
      ctx.fillText(texte, (r.left - cadre.left) * dpr, ligneDeBase);
    }
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, toile);
    gl!.uniform2f(uTaille, largeur, hauteur);
  }

  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cible = { x: 0.5, y: 0.2 };
  const pointeur = { x: 0.5, y: 0.2 };
  let energie = 0;
  let enVue = true;
  let boucle = 0;
  const depart = performance.now();

  function dessiner(maintenant: number) {
    const temps = mouvementReduit.matches ? 6.0 : (maintenant - depart) / 1000;
    pointeur.x += (cible.x - pointeur.x) * 0.12;
    pointeur.y += (cible.y - pointeur.y) * 0.12;
    energie *= 0.955;
    // On s'éloigne du feu en défilant : il baisse.
    const quitte = Math.min(Math.max(window.scrollY / feu.offsetHeight, 0), 1);
    gl!.uniform1f(uTemps, temps);
    gl!.uniform2f(uPointeur, pointeur.x, pointeur.y);
    gl!.uniform1f(uEnergie, energie);
    gl!.uniform1f(uBraise, 1 - quitte * 0.75);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  function tourner(maintenant: number) {
    dessiner(maintenant);
    boucle = requestAnimationFrame(tourner);
  }

  function relancer() {
    cancelAnimationFrame(boucle);
    boucle = 0;
    if (mouvementReduit.matches) {
      requestAnimationFrame(dessiner);
    } else if (enVue && !document.hidden) {
      boucle = requestAnimationFrame(tourner);
    }
  }

  feu.addEventListener('pointermove', (e) => {
    if (mouvementReduit.matches) return;
    const r = feu.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    const vitesse = Math.hypot(x - cible.x, y - cible.y);
    cible.x = x;
    cible.y = y;
    energie = Math.min(1, energie + vitesse * 3.2);
  });

  new IntersectionObserver(([entree]) => {
    enVue = entree.isIntersecting;
    relancer();
  }).observe(feu);
  document.addEventListener('visibilitychange', relancer);
  mouvementReduit.addEventListener('change', relancer);

  let attente = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(attente);
    attente = requestAnimationFrame(() => {
      preparer();
      if (!boucle) requestAnimationFrame(dessiner);
    });
  }).observe(feu);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    cancelAnimationFrame(boucle);
    feu.classList.remove('feu--gl');
  });

  // On attend la vraie police : la texture doit avoir les mêmes formes que le texte.
  document.fonts.load(`400 100px ${getComputedStyle(nom).fontFamily}`).finally(() => {
    preparer();
    dessiner(performance.now());
    feu.classList.add('feu--gl');
    relancer();
  });
}
