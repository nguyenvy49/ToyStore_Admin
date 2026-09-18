import SignInForm from "@/components/auth/SignInForm";
import { FormProvider } from "@/context/FormContext";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function SignIn() {
  const cookieStore = await cookies()
  const token = cookieStore.get("sessionToken")?.value
  const role = cookieStore.get("roleUser")?.value

  if (token && role !== "customer") {
    redirect("/") // redirect server-side
  }
  return (
    <>
      <FormProvider >
        <SignInForm />
      </FormProvider>
    </>
  );
}
