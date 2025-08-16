"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { DreamprintOrder, getOrderByClaimId, updateOrderStatus } from "@/lib/supabase";

export default function ClaimPage() {
  const params = useParams();
  const claimId = params.claimId as string;
  const [order, setOrder] = useState<DreamprintOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (claimId) {
      fetchOrderDetails();
    }
  }, [claimId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const order = await getOrderByClaimId(claimId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      setOrder(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load claim details");
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    try {
      setLoading(true);
      // TODO: Implement NFT minting logic
      console.log(`Minting NFT for claim ${claimId}`);
      
      // Update mint status in database
      await updateOrderStatus(claimId, { minted_status: true });
      
      // Refresh order data
      await fetchOrderDetails();
    } catch (err) {
      console.error("Error minting NFT:", err);
      setError("Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const saveToPhotos = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // For iOS Safari, try to use Web Share API first
    if (navigator.share && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Convert image URL to blob for sharing
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `dreamprint-${claimId}.jpg`, { type: 'image/jpeg' });
          
          navigator.share({
            title: 'Dreamprint Artwork',
            files: [file]
          }).catch(err => {
            console.log('Share failed, falling back to download:', err);
            fallbackDownload(imageUrl);
          });
        })
        .catch(err => {
          console.log('Blob conversion failed, falling back to download:', err);
          fallbackDownload(imageUrl);
        });
    } else {
      // For other browsers, use download
      fallbackDownload(imageUrl);
    }
  };

  const fallbackDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dreamprint-${claimId}.jpg`;
    link.target = '_blank';
    
    // For mobile devices, try to trigger download
    if (link.download !== undefined) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for older browsers
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${imageUrl}" alt="Dreamprint artwork" />`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <div className="text-gray-500">Loading claim details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
              <p className="text-gray-600">{error || "Claim not found"}</p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-pink-500 text-white hover:bg-pink-600"
              >
                Go Home
              </Button>
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
        <div className="text-center mb-2">
          <p className="text-gray-600 text-sm">Claim ID: <span className="font-mono text-pink-600">{claimId}</span></p>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Image Display */}
              {order.image_url && (
                <div className="relative bg-black overflow-hidden" style={{ width: '300px', height: '400px', margin: '30px auto 16px auto' }}>
                  <img
                    src={order.image_url}
                    alt="Dreamprint artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Order Status */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mint Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.minted_status ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.minted_status ? 'Minted' : 'Not Minted'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collage Opt-in:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.collage_opt_in ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.collage_opt_in ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wallet:</span>
                  <span className="text-xs font-mono text-gray-800">
                    {order.wallet_address.slice(0, 6)}...{order.wallet_address.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">

                {/* Show different buttons based on mint status */}
                {!order.minted_status ? (
                  <div>
                    <Button
                      onClick={handleMintNFT}
                      disabled={loading}
                      className="w-full bg-purple-500 text-white hover:bg-purple-600"
                    >
                      {loading ? "Minting..." : "🎨 Mint as NFT"}
                    </Button>
                    {order.image_url && (
                                              <div className="mt-2 w-full" style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => saveToPhotos(order.image_url!)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Save to Photos
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-medium text-sm">
                        ✨ Already minted as NFT!
                      </div>
                      <div className="text-green-500 text-xs mt-1">
                        This artwork has been minted to the blockchain
                      </div>
                    </div>
                    {order.image_url && (
                                              <div className="mt-2 w-full" style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => saveToPhotos(order.image_url!)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Save to Photos
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Share this link to show your Dreamprint!</p>
        </div>
      </div>
    </div>
  );
}
