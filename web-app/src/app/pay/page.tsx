"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PYUSDPayment from "@/components/PYUSDPayment";
import { updateOrderStatus } from "@/lib/supabase";

export default function PayPage() {
  const [claimId, setClaimId] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [collageOptIn, setCollageOptIn] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [isSubmittingShare, setIsSubmittingShare] = useState(false);
  const [shareSubmitted, setShareSubmitted] = useState(false);

  const handlePaymentSuccess = (newClaimId: string, txHash: string) => {
    setClaimId(newClaimId);
    setTransactionHash(txHash);
    setHasPaid(true);
  };

  const submitShareLink = async () => {
    if (!shareLink.trim() || !claimId) {
      alert("Please enter a valid share link");
      return;
    }

    // Basic validation for X/Farcaster links
    const isValidLink = shareLink.includes('x.com') || 
                       shareLink.includes('twitter.com') || 
                       shareLink.includes('farcaster') ||
                       shareLink.includes('warpcast.com');
    
    if (!isValidLink) {
      alert("Please enter a valid X or Farcaster share link");
      return;
    }

    try {
      setIsSubmittingShare(true);
      
      // Update the order with the tweet/share link
      await updateOrderStatus(claimId, { 
        tweet_link: shareLink.trim() 
      });
      
      setShareSubmitted(true);
      console.log("Share link submitted successfully:", shareLink);
      
    } catch (error) {
      console.error("Error submitting share link:", error);
      alert("Failed to submit share link. Please try again.");
    } finally {
      setIsSubmittingShare(false);
    }
  };

  // Show confirmation page if payment is complete
  if (hasPaid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-black mb-2">Payment Submitted!</h1>
            <p className="text-sm text-gray-500">
              (we&apos;ll let you know if the{" "}
              <a 
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                transaction
              </a>
              {" "}fails)
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500 mb-4 mt-8">Claim ID: {claimId}</div>
                <p className="text-gray-600 mb-6">
                  Show this claim ID to the photographer to receive your polaroid print
                </p>
                <div className="bg-gray-100 p-4 rounded mx-8">
                  <p className="text-sm text-gray-700">
                    <strong>What happens next:</strong><br />
                    • Take a photo with the photographer<br />
                    • Choose your art style<br />
                    • Watch it print, then mint it! 
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Link Section */}
          {!shareSubmitted && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-black mt-8 mb-2">📱 Share on Social Media</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Share your photo to get your PYUSD back:
                  </p>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={shareLink}
                      onChange={(e) => setShareLink(e.target.value)}
                      placeholder="Paste your X or Farcaster share link here..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      disabled={isSubmittingShare}
                    />
                    <Button
                      onClick={submitShareLink}
                      disabled={isSubmittingShare || !shareLink.trim()}
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {isSubmittingShare ? "Submitting..." : "Submit Share Link"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Share Link Submitted Confirmation */}
          {shareSubmitted && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-green-600 text-lg font-bold mt-8 mb-2">
                    ✅ Share Link Submitted!
                  </div>
                  <div className="text-green-500 text-sm">
                    Thank you for sharing your Dreamprint experience!
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

            <PYUSDPayment 
              onPaymentSuccess={handlePaymentSuccess}
              collageOptIn={collageOptIn}
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Payment processed onchain</p>
          <p className="mt-1">No personal data collected</p>
        </div>
      </div>
    </div>
  );
}
