"use client";

import Icons, {
  IconRiad, IconKasbah, IconHotel, IconTent, IconBed, IconRoom,
  IconCamel, IconCar, Icon4x4, IconPlane, IconWalk,
  IconDesert, IconMountains, IconCoast, IconMedina, IconPalm, IconOasis,
  IconHiking, IconSurfing, IconCooking, IconSpa, IconShopping, IconCamera,
  IconPool, IconWifi, IconAC, IconBreakfast, IconMeals, IconShower, IconShampoo, IconTowel, IconSlippers,
  IconTagine, IconMintTea, IconArgan, IconZellige, IconLantern, IconDoor,
  IconClock, IconCalendar, IconPeople, IconPrice, IconStar, IconCheck, IconX,
  IconArrowRight, IconArrowLeft, IconChevronDown, IconMenu,
  IconPhone, IconMail, IconWhatsApp, IconInstagram, IconLocation, IconInfo,
} from "@/components/icons";

const iconGroups = [
  {
    title: "Accommodation",
    icons: [
      { name: "Riad", component: IconRiad },
      { name: "Kasbah", component: IconKasbah },
      { name: "Hotel", component: IconHotel },
      { name: "Tent", component: IconTent },
      { name: "Bed", component: IconBed },
      { name: "Room", component: IconRoom },
    ],
  },
  {
    title: "Transport",
    icons: [
      { name: "Camel", component: IconCamel },
      { name: "Car", component: IconCar },
      { name: "4x4", component: Icon4x4 },
      { name: "Plane", component: IconPlane },
      { name: "Walk", component: IconWalk },
    ],
  },
  {
    title: "Landscape & Places",
    icons: [
      { name: "Desert", component: IconDesert },
      { name: "Mountains", component: IconMountains },
      { name: "Coast", component: IconCoast },
      { name: "Medina", component: IconMedina },
      { name: "Palm", component: IconPalm },
      { name: "Oasis", component: IconOasis },
    ],
  },
  {
    title: "Activities",
    icons: [
      { name: "Hiking", component: IconHiking },
      { name: "Surfing", component: IconSurfing },
      { name: "Cooking", component: IconCooking },
      { name: "Spa", component: IconSpa },
      { name: "Shopping", component: IconShopping },
      { name: "Camera", component: IconCamera },
    ],
  },
  {
    title: "Amenities",
    icons: [
      { name: "Pool", component: IconPool },
      { name: "Wifi", component: IconWifi },
      { name: "AC", component: IconAC },
      { name: "Breakfast", component: IconBreakfast },
      { name: "Meals", component: IconMeals },
      { name: "Shower", component: IconShower },
      { name: "Shampoo", component: IconShampoo },
      { name: "Towel", component: IconTowel },
      { name: "Slippers", component: IconSlippers },
    ],
  },
  {
    title: "Moroccan",
    icons: [
      { name: "Tagine", component: IconTagine },
      { name: "MintTea", component: IconMintTea },
      { name: "Argan", component: IconArgan },
      { name: "Zellige", component: IconZellige },
      { name: "Lantern", component: IconLantern },
      { name: "Door", component: IconDoor },
    ],
  },
  {
    title: "Information & UI",
    icons: [
      { name: "Clock", component: IconClock },
      { name: "Calendar", component: IconCalendar },
      { name: "People", component: IconPeople },
      { name: "Price", component: IconPrice },
      { name: "Star", component: IconStar },
      { name: "Check", component: IconCheck },
      { name: "X", component: IconX },
      { name: "ArrowRight", component: IconArrowRight },
      { name: "ArrowLeft", component: IconArrowLeft },
      { name: "ChevronDown", component: IconChevronDown },
      { name: "Menu", component: IconMenu },
    ],
  },
  {
    title: "Contact & Social",
    icons: [
      { name: "Phone", component: IconPhone },
      { name: "Mail", component: IconMail },
      { name: "WhatsApp", component: IconWhatsApp },
      { name: "Instagram", component: IconInstagram },
      { name: "Location", component: IconLocation },
      { name: "Info", component: IconInfo },
    ],
  },
];

export default function IconsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="font-serif text-4xl mb-4">Icon Library</h1>
        <p className="text-muted-foreground mb-12">
          Shared icons for Slow Morocco and Riad di Siena. All icons are 24×24 with 1.5 stroke width.
        </p>

        <div className="space-y-16">
          {iconGroups.map((group) => (
            <section key={group.title}>
              <h2 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                {group.title}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {group.icons.map(({ name, component: IconComponent }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-3 p-4 bg-white border border-border hover:border-foreground/20 transition-colors"
                  >
                    <IconComponent size={32} className="text-foreground" />
                    <span className="text-xs text-muted-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Usage Examples */}
        <section className="mt-20 pt-12 border-t border-border">
          <h2 className="font-serif text-2xl mb-6">Usage</h2>
          
          <div className="bg-[#1a1a1a] text-white p-6 font-mono text-sm overflow-x-auto">
            <pre>{`// Import individual icons
import { IconCamel, IconTagine, IconRiad } from "@/components/icons";

// Or import the Icons object
import Icons from "@/components/icons";

// Use in components
<IconCamel size={24} className="text-amber-600" />
<Icons.Tagine size={32} />

// With custom props
<IconRiad 
  size={48} 
  strokeWidth={1} 
  className="text-muted-foreground hover:text-foreground" 
/>`}</pre>
          </div>
        </section>

        {/* Size Examples */}
        <section className="mt-12">
          <h3 className="text-sm font-medium mb-4">Sizes</h3>
          <div className="flex items-end gap-8">
            <div className="text-center">
              <IconCamel size={16} />
              <p className="text-xs text-muted-foreground mt-2">16</p>
            </div>
            <div className="text-center">
              <IconCamel size={24} />
              <p className="text-xs text-muted-foreground mt-2">24</p>
            </div>
            <div className="text-center">
              <IconCamel size={32} />
              <p className="text-xs text-muted-foreground mt-2">32</p>
            </div>
            <div className="text-center">
              <IconCamel size={48} />
              <p className="text-xs text-muted-foreground mt-2">48</p>
            </div>
            <div className="text-center">
              <IconCamel size={64} />
              <p className="text-xs text-muted-foreground mt-2">64</p>
            </div>
          </div>
        </section>

        {/* Color Examples */}
        <section className="mt-12">
          <h3 className="text-sm font-medium mb-4">Colors</h3>
          <div className="flex items-center gap-6">
            <IconTagine size={32} className="text-foreground" />
            <IconTagine size={32} className="text-muted-foreground" />
            <IconTagine size={32} className="text-amber-600" />
            <IconTagine size={32} className="text-rose-600" />
            <IconTagine size={32} className="text-emerald-600" />
            <IconTagine size={32} className="text-blue-600" />
          </div>
        </section>
      </div>
    </div>
  );
}
