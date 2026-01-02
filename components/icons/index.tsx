import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  children,
  className = "",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// ============================================
// ACCOMMODATION
// ============================================

export const IconRiad: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const IconKasbah: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 20V8l4-4 4 4 4-4 4 4v12H4z" />
  </Icon>
);

export const IconHotel: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M4 10h16" />
    <path d="M10 4v16" />
  </Icon>
);

export const IconTent: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 4L3 20h18L12 4z" />
    <path d="M12 20v-8" />
  </Icon>
);

export const IconBed: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 18v-5h18v5" />
    <path d="M3 13v-2a2 2 0 012-2h14a2 2 0 012 2v2" />
    <circle cx="7" cy="11" r="2" />
  </Icon>
);

export const IconRoom: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M9 3v18" />
  </Icon>
);

// ============================================
// TRANSPORT
// ============================================

export const IconCamel: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 17h14" />
    <path d="M6 17v-3c0-1 1-2 2-2h2l1-3c0-1 1-1.5 2-1.5" />
    <path d="M18 17v-3c0-1-1-2-2-2h-3" />
    <ellipse cx="11" cy="9" rx="2" ry="1" />
    <path d="M16 10l3-4" />
    <circle cx="19.5" cy="5.5" r="1" />
    <path d="M6 17v2M10 17v2M14 17v2M18 17v2" />
  </Icon>
);

export const IconCar: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 15h14l-2-5H7l-2 5z" />
    <path d="M5 15v3h14v-3" />
    <circle cx="7.5" cy="18" r="1.5" />
    <circle cx="16.5" cy="18" r="1.5" />
  </Icon>
);

export const Icon4x4: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 14h16v5H4z" />
    <path d="M5 14V9h14v5" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
  </Icon>
);

export const IconPlane: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 12h5l3-8 3 8h5" />
    <path d="M12 12v8" />
    <path d="M9 20h6" />
  </Icon>
);

export const IconWalk: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="5" r="2" />
    <path d="M10 22l2-7 2 7" />
    <path d="M14 11l-2 4-2-4" />
    <path d="M12 11V8" />
  </Icon>
);

// ============================================
// LANDSCAPE
// ============================================

export const IconDesert: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 17c3-3 6-3 9 0s6 3 9 0" />
    <path d="M3 13c3-3 6-3 9 0s6 3 9 0" />
    <circle cx="18" cy="6" r="2" />
  </Icon>
);

export const IconMountains: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 18l5-10 4 6 3-4 4 8H4z" />
  </Icon>
);

export const IconCoast: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </Icon>
);

export const IconMedina: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 20v-9a7 7 0 0114 0v9" />
    <path d="M10 20v-5a2 2 0 014 0v5" />
  </Icon>
);

export const IconPalm: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 22V10" />
    <path d="M12 10c-4 0-6-4-6-4s4 0 6 0 6 0 6 0-2 4-6 4z" />
  </Icon>
);

export const IconOasis: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <ellipse cx="12" cy="18" rx="7" ry="2" />
    <path d="M12 16V8" />
    <path d="M12 8c-3 0-4-3-4-3s2.5 0 4 0 4 0 4 0-1 3-4 3z" />
  </Icon>
);

// ============================================
// ACTIVITIES
// ============================================

export const IconHiking: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="5" r="2" />
    <path d="M9 22l3-9 3 9" />
    <path d="M7 12l5 1 5-1" />
    <path d="M12 8v5" />
  </Icon>
);

export const IconSurfing: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <ellipse cx="10" cy="11" rx="2" ry="6" transform="rotate(-15 10 11)" />
  </Icon>
);

export const IconCooking: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 8V4" />
    <path d="M8 8V5" />
    <path d="M16 8V5" />
    <path d="M5 12c0-2 3-4 7-4s7 2 7 4v6c0 2-3 4-7 4s-7-2-7-4v-6z" />
  </Icon>
);

export const IconSpa: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4c-2 4-2 8 0 12s2 4 0 4" />
  </Icon>
);

export const IconShopping: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M6 6h13l-1.5 10H7.5L6 6z" />
    <path d="M6 6l-2-4" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="16" cy="19" r="1.5" />
  </Icon>
);

export const IconCamera: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="7" width="18" height="12" rx="2" />
    <circle cx="12" cy="13" r="3" />
    <path d="M8 7V5h8v2" />
  </Icon>
);

// ============================================
// AMENITIES
// ============================================

export const IconPool: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <circle cx="9" cy="9" r="3" />
    <path d="M15 6v7" />
  </Icon>
);

export const IconWifi: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 10c4-4 12-4 16 0" />
    <path d="M7 13c3-3 7-3 10 0" />
    <path d="M10 16c1.5-1.5 2.5-1.5 4 0" />
    <circle cx="12" cy="19" r="1" />
  </Icon>
);

export const IconAC: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="10" rx="1" />
    <path d="M7 18c0-1.5 1-3 2-3s2 1.5 2 3" />
    <path d="M13 18c0-1.5 1-3 2-3s2 1.5 2 3" />
  </Icon>
);

export const IconBreakfast: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 12h10a4 4 0 010 8H5a4 4 0 010-8z" />
    <path d="M15 14h2a2 2 0 010 4h-2" />
    <path d="M8 12V9M10 12V8M12 12V9" />
  </Icon>
);

export const IconMeals: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="14" r="6" />
    <circle cx="12" cy="14" r="2" />
  </Icon>
);

export const IconShower: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 5v15" />
    <path d="M4 8h12a4 4 0 014 4" />
    <path d="M14 14v2M11 15v2M17 15v2M14 19v2" />
  </Icon>
);

export const IconShampoo: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="8" y="8" width="8" height="12" rx="1" />
    <path d="M10 8V6a2 2 0 014 0v2" />
    <path d="M10 12h4" />
  </Icon>
);

export const IconTowel: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="6" width="16" height="4" rx="1" />
    <path d="M6 10v10M18 10v10" />
    <path d="M6 20h12" />
  </Icon>
);

export const IconSlippers: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <ellipse cx="7" cy="15" rx="4" ry="5" />
    <ellipse cx="17" cy="15" rx="4" ry="5" />
    <path d="M5 11a2 2 0 014 0M15 11a2 2 0 014 0" />
  </Icon>
);

// ============================================
// MOROCCAN
// ============================================

export const IconTagine: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 18h14" />
    <path d="M6 18c0-3 2.5-5 6-5s6 2 6 5" />
    <path d="M12 5l3 8H9l3-8z" />
  </Icon>
);

export const IconMintTea: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M8 8h8l-1 12H9L8 8z" />
    <path d="M7 8h10" />
    <path d="M10 8V6a2 2 0 014 0v2" />
  </Icon>
);

export const IconArgan: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="9" r="4" />
    <path d="M12 13v8" />
    <path d="M8 21h8" />
  </Icon>
);

export const IconZellige: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" />
    <path d="M12 4v16M4 12h16" />
    <path d="M4 4l16 16M20 4L4 20" />
  </Icon>
);

export const IconLantern: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M10 3h4v2h-4z" />
    <path d="M8 5h8l1 4v8l-1 4H8l-1-4V9l1-4z" />
    <circle cx="12" cy="13" r="2" />
  </Icon>
);

export const IconDoor: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M6 21V9a6 6 0 0112 0v12" />
    <circle cx="14" cy="14" r="1" />
  </Icon>
);

// ============================================
// UI
// ============================================

export const IconClock: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
  </Icon>
);

export const IconCalendar: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="5" width="16" height="16" rx="1" />
    <path d="M4 10h16" />
    <path d="M8 3v4M16 3v4" />
  </Icon>
);

export const IconPeople: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M4 20c0-3 2.5-5 5-5s5 2 5 5" />
    <circle cx="17" cy="8" r="2" />
    <path d="M17 13c2 0 3.5 1.5 3.5 3.5" />
  </Icon>
);

export const IconPrice: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v2M12 16v2" />
    <path d="M9 10c0-1 1-2 3-2s3 1 3 2-1 2-3 2-3 1-3 2 1 2 3 2 3-1 3-2" />
  </Icon>
);

export const IconStar: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 3l2.5 6.5L21 10l-5 4.5 1.5 6.5-5.5-3.5L6.5 21 8 14.5 3 10l6.5-.5L12 3z" />
  </Icon>
);

export const IconCheck: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Icon>
);

export const IconX: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

export const IconArrowRight: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const IconArrowLeft: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Icon>
);

export const IconChevronDown: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const IconMenu: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const IconPhone: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </Icon>
);

export const IconMail: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 5l9 7 9-7" />
  </Icon>
);

export const IconWhatsApp: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 2a10 10 0 00-8.6 15L2 22l5-1.4A10 10 0 1012 2z" />
    <path d="M9 10c.5 1.5 1.5 2.5 3 3l.5-.5c.5-.5 1-.5 1.5 0l1 1c.5.5.5 1 0 1.5-.5.5-1.5 1-2.5.5-2-.5-4-2.5-5-5-.5-1 0-2 .5-2.5.5-.5 1-.5 1.5 0l.5.5c.5.5.5 1 0 1.5z" />
  </Icon>
);

export const IconInstagram: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconLocation: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 2C8 2 5 5.5 5 9c0 5 7 13 7 13s7-8 7-13c0-3.5-3-7-7-7z" />
    <circle cx="12" cy="9" r="2" />
  </Icon>
);

export const IconInfo: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

// ============================================
// DEFAULT EXPORT
// ============================================

const Icons = {
  Riad: IconRiad,
  Kasbah: IconKasbah,
  Hotel: IconHotel,
  Tent: IconTent,
  Bed: IconBed,
  Room: IconRoom,
  Camel: IconCamel,
  Car: IconCar,
  "4x4": Icon4x4,
  Plane: IconPlane,
  Walk: IconWalk,
  Desert: IconDesert,
  Mountains: IconMountains,
  Coast: IconCoast,
  Medina: IconMedina,
  Palm: IconPalm,
  Oasis: IconOasis,
  Hiking: IconHiking,
  Surfing: IconSurfing,
  Cooking: IconCooking,
  Spa: IconSpa,
  Shopping: IconShopping,
  Camera: IconCamera,
  Pool: IconPool,
  Wifi: IconWifi,
  AC: IconAC,
  Breakfast: IconBreakfast,
  Meals: IconMeals,
  Shower: IconShower,
  Shampoo: IconShampoo,
  Towel: IconTowel,
  Slippers: IconSlippers,
  Tagine: IconTagine,
  MintTea: IconMintTea,
  Argan: IconArgan,
  Zellige: IconZellige,
  Lantern: IconLantern,
  Door: IconDoor,
  Clock: IconClock,
  Calendar: IconCalendar,
  People: IconPeople,
  Price: IconPrice,
  Star: IconStar,
  Check: IconCheck,
  X: IconX,
  ArrowRight: IconArrowRight,
  ArrowLeft: IconArrowLeft,
  ChevronDown: IconChevronDown,
  Menu: IconMenu,
  Phone: IconPhone,
  Mail: IconMail,
  WhatsApp: IconWhatsApp,
  Instagram: IconInstagram,
  Location: IconLocation,
  Info: IconInfo,
};

export default Icons;
