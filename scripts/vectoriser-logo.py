"""
Vectorise le logo de La Fiamma à partir de l'image extraite de l'ancien site.

Chaque couleur du dessin est détourée séparément puis tracée (vtracer, mode binaire),
et recoloriée avec la palette du site. Usage : python scripts/vectoriser-logo.py
"""
import re
from pathlib import Path

import numpy as np
import vtracer
from PIL import Image, ImageFilter

ICI = Path(__file__).parent
SORTIE = ICI.parent / "src" / "assets"
ECHELLE = 2  # on agrandit avant de tracer : courbes plus douces

# Couleurs mesurées dans l'image source → couleurs du site.
SOURCE = {
    "fond": (138, 130, 116),
    "olive": (62, 59, 29),
    "bois": (106, 92, 58),
    "flamme": (114, 87, 45),
    "nuit": (39, 54, 58),
    "reflet": (72, 80, 78),
}
PALETTE = {
    "olive": "#4D5226",
    "bois": "#8C7A45",
    "flamme": "#C8873A",
    "nuit": "#1C2E3B",
    "reflet": "#5B7584",
}
# Ordre d'empilement (du dessous vers le dessus) et dilatation pour éviter les liserés.
COUCHES = [("olive", 2), ("bois", 1), ("flamme", 1), ("nuit", 1), ("reflet", 0)]


def classer(img: np.ndarray) -> np.ndarray:
    noms = list(SOURCE)
    centres = np.array([SOURCE[n] for n in noms], dtype=float)
    dist = ((img[:, :, None, :] - centres[None, None]) ** 2).sum(-1)
    return dist.argmin(-1), noms


def _morpho(masque: np.ndarray, filtre, taille: int) -> np.ndarray:
    image = Image.fromarray((masque * 255).astype(np.uint8)).filter(filtre(taille))
    return np.asarray(image) > 127


def nettoyer(etiquettes: np.ndarray, noms: list[str]) -> np.ndarray:
    """Corrige les deux artefacts du détourage.

    1. Les pixels de transition entre le dessin et le fond ont une teinte proche de « bois » :
       ils formaient un liseré brun autour de tout. On les rend à la couleur voisine.
    2. Les reflets clairs des bûches tombent dans « fond » : ce seraient des trous
       sur un fond sombre. Tout fond enclavé dans le dessin devient « bois ».
    """
    e = etiquettes.copy()
    fond, bois = noms.index("fond"), noms.index("bois")
    olive, flamme = noms.index("olive"), noms.index("flamme")

    # 2. trous : le fond extérieur est celui qu'on atteint depuis le bord.
    exterieur = Image.fromarray(((e == fond) * 255).astype(np.uint8)).copy()  # copie modifiable
    from PIL import ImageDraw
    ImageDraw.floodfill(exterieur, (0, 0), 128)
    enclave = np.asarray(exterieur) == 255
    e[enclave] = bois

    # 1. liseré : « bois » à moins de 4 px (×échelle) du fond extérieur.
    dessin = e != fond
    bord = (e == bois) & ~_morpho(dessin, ImageFilter.MinFilter, 9)
    pres_olive = _morpho(e == olive, ImageFilter.MaxFilter, 11)
    pres_flamme = _morpho(e == flamme, ImageFilter.MaxFilter, 11)
    e[bord & pres_flamme] = flamme
    e[bord & pres_olive & ~pres_flamme] = olive
    return e


def tracer(masque: np.ndarray) -> list[str]:
    image = Image.fromarray(np.where(masque, 0, 255).astype(np.uint8)).convert("RGB")
    chemin = ICI / "_masque.png"
    image.save(chemin)
    svg = vtracer.convert_image_to_svg_py(
        str(chemin), str(ICI / "_trace.svg"),
        colormode="binary", mode="spline", filter_speckle=40,
        corner_threshold=60, length_threshold=8.0, splice_threshold=45, path_precision=1,
    )
    texte = (ICI / "_trace.svg").read_text()
    chemin.unlink(); (ICI / "_trace.svg").unlink()
    return re.findall(r'<path d="([^"]+)"[^>]*transform="translate\(([-\d.]+),([-\d.]+)\)"', texte)


def construire(zone: tuple[int, int, int, int], couches: list[str], fichier: str, monochrome: bool = False):
    source = Image.open(ICI / "logo-source.png").convert("RGB").crop(zone)
    source = source.resize((source.width * ECHELLE, source.height * ECHELLE), Image.LANCZOS)
    source = source.filter(ImageFilter.MedianFilter(5))
    etiquettes, noms = classer(np.asarray(source, dtype=float))
    etiquettes = nettoyer(etiquettes, noms)
    morceaux = []
    for nom, dilatation in COUCHES:
        if nom not in couches:
            continue
        # Un calque couvre aussi ce qui est posé dessus : pas de trou si un détail saute au tracé.
        dessous = {"olive": ["olive", "bois"], "nuit": ["nuit", "reflet"]}.get(nom, [nom])
        masque = np.isin(etiquettes, [noms.index(n) for n in dessous])
        masque = Image.fromarray((masque * 255).astype(np.uint8))
        if dilatation:
            masque = masque.filter(ImageFilter.MaxFilter(dilatation * 2 + 1))
        # Lissage puis seuil : des bords nets, donc beaucoup moins de points à tracer.
        masque = masque.filter(ImageFilter.GaussianBlur(2.2))
        remplissage = "currentColor" if monochrome else PALETTE[nom]
        for d, tx, ty in tracer(np.asarray(masque) > 127):
            morceaux.append(f'<path class="{nom}" fill="{remplissage}" transform="translate({tx},{ty})" d="{d}"/>')
    l, h = source.width, source.height
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {l} {h}">{"".join(morceaux)}</svg>\n'
    SORTIE.mkdir(parents=True, exist_ok=True)
    (SORTIE / fichier).write_text(svg)
    print(fichier, len(morceaux), "chemins,", len(svg) // 1024, "Ko")


if __name__ == "__main__":
    construire((300, 50, 1020, 770), list(PALETTE), "logo-illustration.svg")
    construire((370, 50, 770, 600), ["flamme"], "flamme.svg", monochrome=True)
