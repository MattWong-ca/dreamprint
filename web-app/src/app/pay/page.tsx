"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function PayPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [collageOptIn, setCollageOptIn] = useState(false);
  const [claimId, setClaimId] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const { primaryWallet } = useDynamicContext();

  const handlePayment = async () => {
    if (!primaryWallet) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Processing payment...");

    try {
      // Simulate payment transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoadingMessage("Generating claim ID...");
      
      // Simulate claim ID generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newClaimId = generateClaimId();
      setClaimId(newClaimId);
      
      // Here you would send to Supabase:
      // - claimId
      // - wallet address (primaryWallet.address)
      // - paid: true
      // - collageOptIn
      
      console.log("Payment successful!", {
        claimId: newClaimId,
        wallet: primaryWallet.address,
        paid: true,
        collageOptIn
      });
      
      // Reset loading state and mark as paid
      setIsLoading(false);
      setLoadingMessage("");
      setHasPaid(true);
      
    } catch (error) {
      console.error("Payment failed:", error);
      setIsLoading(false);
      setLoadingMessage("");
      alert("Payment failed. Please try again.");
    }
  };

  const generateClaimId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Show confirmation page if payment is complete
  if (hasPaid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-black mb-2">Payment Successful!</h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500 mb-4 mt-8">Claim ID: {claimId}</div>
                <p className="text-gray-600 mb-6">
                  Show this claim ID to the photographer to receive your polaroid print
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded mx-8">
                <p className="text-sm text-gray-700">
                  <strong>What happens next:</strong><br />
                  • Take a photo with the photographer<br />
                  • Choose your art style<br />
                  • Watch it print, then mint it! 
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>Thank you for using Dreamprint!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Get Your Polaroid Print</h1>
          <p className="text-gray-600">Anime, Graffiti, & Pop Art style polaroid prints</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6 mt-8">
              <div className="text-4xl font-bold text-pink-500 mb-2">1 PYUSD</div>
              <p className="text-gray-600 text-sm">Instant print on Fujifilm Instax Mini film</p>
            </div>

            <div className="mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collageOptIn}
                  onChange={(e) => setCollageOptIn(e.target.checked)}
                  className="mt-1 w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                />
                <div>
                  <div className="font-medium text-black">Opt in to collage</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Allow your photo to be featured in our community collage. 
                    Sponsors may share this on socials!
                  </div>
                </div>
              </label>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg disabled:opacity-50"
            >
              {isLoading ? loadingMessage : "Pay 1 PYUSD"}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <p className="text-gray-600">{loadingMessage}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Payment processed onchain</p>
          <p className="mt-1">No personal data collected</p>
        </div>
      </div>
    </div>
  );
}
