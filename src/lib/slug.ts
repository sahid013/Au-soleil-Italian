/**
 * Turn a dish name into a URL/file-safe slug.
 * Mirrors the original site so video files keep the same names:
 * "Linguine du Soleil" -> "linguine-du-soleil" -> /videos/linguine-du-soleil.mp4
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
