import { redirect } from "next/navigation";

export default function AutoComboRedirectPage() {
  redirect("/admin/combos?filter=intelligent");
}
