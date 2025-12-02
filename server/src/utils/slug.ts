import prisma from "../prisma";

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") //////we remove special char
    .replace(/\s+/g, "-") /////we replace spoaces with -
    .replace(/-+/g, "-") //replacing multiple - with single dash
    .replace(/^-+|-+$/g, ""); /////remove - at start or end
}

///this handles slug generaation in a case where t
export async function generateUniqueSlug(title: string): Promise<string> {
  let base = generateSlug(title);
  let uniqueSlug = base;
  let counter = 1;

  while (await prisma.course.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${base}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
