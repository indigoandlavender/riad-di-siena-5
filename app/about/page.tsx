import { redirect } from "next/navigation";

// Redirect /about to /philosophy for Riad di Siena
export default function AboutPage() {
  redirect("/philosophy");
}
