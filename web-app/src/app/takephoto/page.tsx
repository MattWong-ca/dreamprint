"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { updateOrderStatus, DreamprintOrder } from "@/lib/supabase";

export default function TakePhotoPage() {
  const searchParams = useSearchParams();
  const claimId = searchParams.get('claimId');
  const [orderDetails, setOrderDetails] = useState<DreamprintOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);

  useEffect(() => {
    if (claimId) {
      // For now, just show the claim ID
      // In a real implementation, you'd fetch the order details
      setLoading(false);
    } else {
      setError("No claim ID provided");
      setLoading(false);
    }
  }, [claimId]);

  const handleTakePhoto = () => {
    // Placeholder for photo taking functionality
    setPhotoTaken(true);
    console.log(`Taking photo for claim ID: ${claimId}`);
  };

  const handleCompleteOrder = async () => {
    if (!claimId) return;
    
    try {
      // Update the order status to minted
      await updateOrderStatus(claimId, {
        minted_status: true,
        image_url: `https://example.com/images/${claimId}.jpg` // Placeholder URL
      });
      
      console.log(`Order ${claimId} marked as complete`);
      alert("Order completed successfully!");
    } catch (err) {
      console.error("Failed to complete order:", err);
      alert("Failed to complete order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !claimId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
              <p className="text-gray-600">{error || "Invalid claim ID"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Take Photo</h1>
          <p className="text-gray-600">Claim ID: <span className="font-mono text-pink-600">{claimId}</span></p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              {!photoTaken ? (
                <>
                  <div className="text-6xl mb-4">📷</div>
                  <h2 className="text-xl font-bold text-black mb-4">Ready to take photo</h2>
                  <p className="text-gray-600 mb-6">
                    Position the customer and take their polaroid photo
                  </p>
                  <Button 
                    onClick={handleTakePhoto}
                    className="w-full bg-pink-500 text-white hover:bg-pink-600 py-3 text-lg"
                  >
                    Take Photo 📸
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-xl font-bold text-black mb-4">Photo Taken!</h2>
                  <p className="text-gray-600 mb-6">
                    Photo has been taken and processed. Ready to complete the order.
                  </p>
                  <Button 
                    onClick={handleCompleteOrder}
                    className="w-full bg-green-500 text-white hover:bg-green-600 py-3 text-lg"
                  >
                    Complete Order ✨
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Dreamprint Photo Station</p>
          <p className="mt-1">Claim ID: {claimId}</p>
        </div>
      </div>
    </div>
  );
}
