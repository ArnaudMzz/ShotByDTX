// src/components/Layout.tsx
import Navbar from "./Navbar";
import Footer from "./Footer";
import ThemeToggle from "../components/ThemeToggle";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <ThemeToggle />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
