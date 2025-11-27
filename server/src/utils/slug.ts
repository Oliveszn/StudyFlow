export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") //////we remove special char
    .replace(/\s+/g, "-") /////we replace spoaces with -
    .replace(/-+/g, "-") //replacing multiple - with single dash
    .replace(/^-+|-+$/g, ""); /////remove - at start or end
}
