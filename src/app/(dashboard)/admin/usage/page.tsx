import { redirect } from "next/navigation";

export default function UsageRedirectPage() {
  redirect("/admin/logs");
}
