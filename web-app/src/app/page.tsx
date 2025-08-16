import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-semibold">Dreamprint</div>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Instant AI polaroid prints for crypto events
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Instant Anime, Graffiti, and Pop Art prints that make your crypto events unforgettable!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg">
              Get Started →
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
              View Demo →
            </Button>
          </div>

          {/* Sample Images Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="aspect-square bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
              <img
                src="/crypto-enthusiast-polaroid.png"
                alt="AI Polaroid Sample 1"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="aspect-square bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
              <img
                src="/placeholder-bczcz.png"
                alt="AI Polaroid Sample 2"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="aspect-square bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
              <img
                src="/nft-collector-crypto-meetup-polaroid.png"
                alt="AI Polaroid Sample 3"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="aspect-square bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
              <img
                src="/web3-entrepreneur-polaroid.png"
                alt="AI Polaroid Sample 4"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect & Customize</h3>
                <p className="text-gray-600">
                  Connect your wallet and let our AI generate a personalized polaroid featuring your brand and the
                  attendee
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Print & Share</h3>
                <p className="text-gray-600">
                  Instantly print on Fujifilm Instax Mini film and encourage sharing on X or Farcaster for maximum
                  virality
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Onchain Impact</h3>
                <p className="text-gray-600">
                  Each interaction brings users into your ecosystem while providing live UX feedback and measurable ROI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-8">Simple Pricing</h2>
          <p className="text-xl text-gray-600 mb-16">75% cheaper than T-shirts with 10x the engagement</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Option - Highlighted */}
            <Card className="relative border-2 border-pink-500 shadow-lg pt-8 flex flex-col">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-4 py-1">
                RECOMMENDED
              </Badge>
              <CardContent className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <div className="text-4xl font-bold text-pink-500 mb-6">
                  $0
                  <span className="text-lg text-gray-500 font-normal"> PYUSD</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Pay for a photo, share it, and get your money back
                </p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    AI-generated polaroid
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Instant Fujifilm print
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Social sharing bonus
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Onchain verification
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">Try now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Paid Option */}
            <Card className="pt-8 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-4">Standard</h3>
                <div className="text-4xl font-bold text-black mb-6">
                  $1
                  <span className="text-lg text-gray-500 font-normal"> PYUSD</span>
                </div>
                <p className="text-gray-600 mb-8">For those who prefer not to share on social media</p>
                <ul className="text-left space-y-3 mb-8">
                  
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✗</span>
                    $1 more expensive
                  </li>
                 
                </ul>
                <div className="mt-auto">
                  <Button variant="outline" className="w-full bg-transparent">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            * For sponsors: 500 pieces cost 75% less than T-shirts, while providing live UX feedback and measurable
            onchain engagement
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-semibold mb-4">Dreamprint</div>
          <p className="text-gray-400 mb-8">Making your crypto events unforgettable, one polaroid at a time</p>
        </div>
      </footer>
    </div>
  )
}