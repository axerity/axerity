import { buildSidebar, flattenSections } from './tree';

export const sidebar = buildSidebar();
export const flatPages = flattenSections(sidebar);

export { buildSidebar, flattenSections };
