import Navbar from "@/components/Navbar";

export default function PayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Hello World</h1>
          <p className="text-gray-600">This is the /pay route</p>
          
        </div>
      </div>
    </div>
  );
}
