/*
*HELPER TO GET USER'S INITIALS
*/

 // Combine names and get first 2 initials
 export const getInitials = (first: string, last?: string) => {
    const full = [first, last].filter(Boolean).join(" ");
    return full
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };