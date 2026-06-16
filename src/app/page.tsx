import { getMenu, getSite } from "@/lib/menu";
import { MenuTemplate } from "@/components/templates/MenuTemplate";

/**
 * Menu page (server component). Fetches the menu + site data through the
 * data-access layer — local JSON today, backend API later — and hands it to
 * the client template. This is the only place data is loaded.
 */
export default async function MenuPage() {
  const [menu, site] = await Promise.all([getMenu(), getSite()]);
  return <MenuTemplate menu={menu} site={site} />;
}
