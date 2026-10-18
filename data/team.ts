export type Person = {
  id: string;
  name: string;
  role: string;
  /** Drop a file in public/team/<id>.jpg and set this to "/team/<id>.jpg". */
  photo?: string;
};

const ORGANISER_ROLES = [
  "Organiser",
  "Organiser",
  "Co-organiser",
  "Program lead",
  "Sponsorships",
  "Design & brand",
];

const VOLUNTEER_ROLES = [
  "Registration",
  "Stage",
  "Workshops",
  "Hospitality",
  "Social media",
  "Photography",
  "Speaker care",
  "Tech support",
];

// Placeholder people from the design — replace names as the team is confirmed.
export const ORGANISERS: Person[] = ORGANISER_ROLES.map((role, i) => ({
  id: `organiser-${i + 1}`,
  name: "Full Name",
  role,
}));

export const VOLUNTEERS: Person[] = Array.from({ length: 16 }, (_, i) => ({
  id: `volunteer-${i + 1}`,
  name: "Full Name",
  role: VOLUNTEER_ROLES[i % VOLUNTEER_ROLES.length],
}));
