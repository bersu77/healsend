import { redirect } from "next/navigation";
import { buildLoginPath } from "@/lib/auth-routing";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  redirect(buildLoginPath(params?.redirect || ""));
}
