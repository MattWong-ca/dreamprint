import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">Dreamprint</div>
        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
}
