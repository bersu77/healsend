import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
