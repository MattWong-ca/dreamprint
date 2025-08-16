import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  return (
    <nav className={`sticky top-0 z-50 bg-black text-white px-6 py-4 ${poppins.className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold hover:text-gray-300 transition-colors">
          Dreamprint
        </Link>
        <DynamicWidget />
      </div>
    </nav>
  );
}
