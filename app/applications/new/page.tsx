import { redirect } from "next/navigation";

export default function PublicNewApplicationRedirect() {
  redirect("/dashboard/applications/new");
}
