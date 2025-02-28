import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, ShieldCheck, Zap, Lock, BadgeDollarSign } from "lucide-react"
import { useNavigate } from 'react-router-dom';
function Home() {

  const navigate = useNavigate();
  return (

    <>
      <div className='bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white'>


        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Decentralized Auctions Reimagined
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience the future of auctions with our commit-reveal protocol. Secure, transparent, and truly
              decentralized.
            </p>
            <div
              onClick={() => navigate('/auctions')}>            <Button className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-4 rounded-full" >
                Start Bidding <ArrowRight className="ml-2" />
              </Button></div>

          </section>

          <section id="features" className="container mx-auto px-auto  py-20">
            <h2 className="text-4xl font-bold mb-12 text-center"> Features</h2>
            <div className='flex items-center justify-center'>
            <div className="grid md:grid-cols-2 w-2/3  gap-8">
              <FeatureCard
                icon={<BadgeDollarSign className="w-12 h-12 text-purple-400" />}
                title="Vickrey-Clarke-Groves (VCG) Auction"
                description="where the highest bidder wins but pays the second-highest bid, ensuring fairness and truthful bidding."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-12 h-12 text-purple-400" />}
                title="Commit-Reveal Protocol"
                description="Ensure fair and tamper-proof bidding with our advanced commit-reveal mechanism."
              />
              <FeatureCard
                icon={<Lock className="w-12 h-12 text-purple-400" />}
                title="Fully Decentralized"
                description="No central authority. Auctions run entirely on smart contracts for maximum security."
              />
              <FeatureCard
                icon={<Zap className="w-12 h-12 text-purple-400" />}
                title="Lightning Fast"
                description="Experience near-instant transactions and real-time updates on auction status."
              />
            </div></div>
          </section>

          <section id="how-it-works" className="container mx-auto px-6 py-20 bg-purple-900 bg-opacity-20 shadow-xl rounded-2xl">
      <h2 className="text-5xl font-bold mb-12 text-center text-white">How It Works</h2>
      <div className="flex flex-col items-center space-y-12 max-w-3xl mx-auto">
        {[ 
          "Connect your MetaMask wallet",
          "Explore the auctions listed on DecentBid",
          "Commit your bid along with a hashed salt",
          "Wait for the commit phase to end",
          "Reveal your bid during the reveal phase",
          "Auction follows the Vickrey-Clarke-Groves (VCG) principle, where the second-highest bid determines the price",
          "If you win, claim your item. If not, receive a full refund"
        ].map((step, index) => (
          <div key={index} className="relative flex items-center w-full">
            <div className="flex flex-col items-center">
              <div className="bg-purple-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-md">
                {index + 1}
              </div>
              {index < 6 && <div className="w-1 h-16 bg-purple-500"></div>}
            </div>
            <div className="ml-6 p-6 bg-white/80 shadow-lg rounded-lg w-full">
              <p className="text-lg text-gray-800 font-semibold">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

          <section id="benefits" className="container mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold mb-12 text-center">Why Choose DecentBid?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <BenefitCard
                title="Unmatched Security"
                description="Our commit-reveal protocol ensures that your bids remain secret until the reveal phase, preventing manipulation and front-running."
              />
              <BenefitCard
                title="True Decentralization"
                description="No central authority means no single point of failure. Your auctions are governed by immutable smart contracts."
              />
              <BenefitCard
                title="Transparent & Fair"
                description="All auction data is publicly verifiable on the blockchain, ensuring complete transparency and fairness for all participants."
              />
              <BenefitCard
                title="Global Accessibility"
                description="Participate in auctions from anywhere in the world, 24/7, with just an internet connection and a crypto wallet."
              />
            </div>
          </section>

          <section className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Revolutionize Your Auction Experience?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the future of decentralized auctions today. Start bidding, selling, and experiencing the power of
              blockchain technology.
            </p>
            <div onClick={() => navigate('/auctions')}>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-4 rounded-full">
                Launch App
              </Button>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}



function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-purple-800 bg-opacity-50 p-6 rounded-xl text-center shadow-xl ">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-purple-200">{description}</p>
    </div>
  )
}

function BenefitCard({ title, description }) {
  return (
    <div className="bg-purple-800 bg-opacity-30 p-6 rounded-xl shadow-xl">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-purple-200">{description}</p>
    </div>
  )
}
















export default Home;
