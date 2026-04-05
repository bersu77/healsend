import { redirect } from "next/navigation";
import { buildSignupPath } from "@/lib/auth-routing";

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  redirect(buildSignupPath(params?.redirect || ""));
}
