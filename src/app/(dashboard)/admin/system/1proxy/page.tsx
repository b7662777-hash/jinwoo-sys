import { redirect } from "next/navigation";

export default function OneProxyPage() {
  redirect("/admin/system/proxy?tab=free-pool");
}
