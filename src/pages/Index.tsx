
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AppHeader } from '@/components/AppHeader';
import { getConnectionState } from '@/lib/web3';
import { motion } from 'framer-motion';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const state = getConnectionState();
    setIsConnected(state.isConnected);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Base background layer */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Deep space background with stars */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{
            backgroundImage: "url('/images/space-background.jpg')",
            backgroundAttachment: 'fixed',
          }}
        ></div>

        {/* Animated nebula overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-slow-drift"
          style={{
            backgroundImage: "url('/images/nebula-overlay.png')",
            backgroundBlendMode: 'screen',
            filter: 'hue-rotate(15deg)',
          }}
        ></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-gray-900/70 to-black/90 backdrop-blur-[2px]"></div>

        {/* Animated stars */}
        <div className="stars-container"></div>
      </div>

      {/* Floating particles with enhanced effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="particle-lg particle-1 animate-pulse-slow"></div>
        <div className="particle-lg particle-2 animate-pulse-slow"></div>
        <div className="particle-lg particle-3 animate-pulse-slow"></div>
        <div className="particle-lg particle-4 animate-pulse-slow" style={{ top: '60%', right: '10%', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0) 70%)', animationDelay: '-15s', animationDuration: '35s' }}></div>
        <div className="particle-lg particle-5 animate-pulse-slow" style={{ top: '75%', left: '50%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)', animationDelay: '-20s', animationDuration: '40s' }}></div>
        <div className="particle-lg particle-6 animate-pulse-slow" style={{ top: '15%', right: '30%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(124, 58, 237, 0) 70%)', animationDelay: '-8s', animationDuration: '45s' }}></div>
        <div className="particle-lg particle-7 animate-pulse-slow" style={{ bottom: '35%', left: '15%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, rgba(217, 70, 239, 0) 70%)', animationDelay: '-25s', animationDuration: '38s' }}></div>
      </div>

      {/* Parallax foreground elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="nebula-glow nebula-glow-1"></div>
        <div className="nebula-glow nebula-glow-2"></div>
        <div className="nebula-glow nebula-glow-3"></div>
      </div>

      {/* Content layer - must be above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />

        <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              <span className="text-gradient-meta text-glow text-float" style={{ animationDelay: '0.0s' }}>M</span>
              <span className="text-blue-300 text-glow text-float" style={{ animationDelay: '0.1s' }}>e</span>
              <span className="text-sky-300 text-glow text-float" style={{ animationDelay: '0.2s' }}>t</span>
              <span className="text-blue-200 text-glow text-float" style={{ animationDelay: '0.3s' }}>a</span>
              <span className="text-gradient-monsters text-glow text-float" style={{ animationDelay: '0.4s' }}>M</span>
              <span className="text-violet-300 text-glow text-float" style={{ animationDelay: '0.5s' }}>o</span>
              <span className="text-purple-300 text-glow text-float" style={{ animationDelay: '0.6s' }}>n</span>
              <span className="text-fuchsia-300 text-glow text-float" style={{ animationDelay: '0.7s' }}>s</span>
              <span className="text-pink-300 text-glow text-float" style={{ animationDelay: '0.8s' }}>t</span>
              <span className="text-fuchsia-300 text-glow text-float" style={{ animationDelay: '0.9s' }}>e</span>
              <span className="text-purple-300 text-glow text-float" style={{ animationDelay: '1.0s' }}>r</span>
              <span className="text-violet-300 text-glow text-float" style={{ animationDelay: '1.1s' }}>s</span>
              <span className="text-gradient-arena text-glow text-float" style={{ animationDelay: '1.2s' }}>A</span>
              <span className="text-blue-300 text-glow text-float" style={{ animationDelay: '1.3s' }}>r</span>
              <span className="text-sky-300 text-glow text-float" style={{ animationDelay: '1.4s' }}>e</span>
              <span className="text-blue-200 text-glow text-float" style={{ animationDelay: '1.5s' }}>n</span>
              <span className="text-sky-200 text-glow text-float" style={{ animationDelay: '1.6s' }}>a</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-game-foreground/90 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Evolve, Battle, Thrive on Monad Blockchain
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isConnected ? (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary-bright hover:to-game-secondary-bright text-white shadow-lg shadow-game-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-primary/30 hover:-translate-y-1">
                    <Link to="/monsters">View My Monsters</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 border-game-primary/50 text-game-primary hover:bg-game-primary/10 transition-all duration-300 hover:-translate-y-1">
                    <Link to="/battle">Enter Battle Arena</Link>
                  </Button>
                </>
              ) : (
                <div className="glass-card p-4 rounded-lg animate-pulse-border">
                  <p className="text-lg text-game-foreground/90">
                    Connect your wallet to start your monster journey!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-card feature-card-top feature-card-collect p-0 rounded-lg hover:border-game-primary/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Collect & <span className="text-game-primary-bright">Evolve</span></h3>
                <p className="text-gray-300">
                  Mint unique monsters with randomly generated attributes. Level up and evolve your monsters to increase their power.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-card feature-card-top feature-card-battle p-0 rounded-lg hover:border-game-secondary/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white"><span className="text-game-secondary-bright">Battle</span></h3>
                <p className="text-gray-300">
                  Challenge other players' monsters in the battle arena. Win to earn experience and climb the rankings.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="glass-card feature-card-top feature-card-trade p-0 rounded-lg hover:border-game-accent/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white"><span className="text-game-accent-bright">Trade</span></h3>
                <p className="text-gray-300">
                  Your monsters are NFTs on the Monad blockchain. Trade, sell, or gift them to other players.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Built on <span className="text-game-primary-bright">Monad Blockchain</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-game-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-br from-game-primary to-game-secondary rounded-full p-3 mt-1 shadow-lg shadow-game-primary/20 animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 2v20" />
                      <path d="M2 5h20" />
                      <path d="M21 16H2" />
                      <path d="M7 2v20" />
                      <path d="M17 2v20" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Parallel <span className="text-game-primary-bright">Execution</span></h3>
                    <p className="text-gray-300">
                      Experience blazing fast monster evolutions and battles thanks to Monad's parallel transaction processing.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-xl p-6 hover:border-game-secondary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-br from-game-secondary to-game-accent rounded-full p-3 mt-1 shadow-lg shadow-game-secondary/20 animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 12v.01" />
                      <path d="M19.071 4.929c-1.948-1.95-5.055-1.95-7.003 0-.153.154-.295.32-.425.496-.13-.176-.272-.342-.425-.496-1.948-1.95-5.055-1.95-7.003 0-1.95 1.948-1.95 5.055 0 7.003.154.153.32.295.496.425-.176.13-.342.272-.496.425-1.95 1.948-1.95 5.055 0 7.003 1.948 1.95 5.055 1.95 7.003 0 .153-.154.295-.32.425-.496.13.176.272.342.425.496 1.948 1.95 5.055 1.95 7.003 0 1.95-1.948 1.95-5.055 0-7.003-.154-.153-.32-.295-.496-.425.176-.13.342-.272.496-.425 1.95-1.948 1.95-5.055 0-7.003Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">EVM <span className="text-game-secondary-bright">Compatible</span></h3>
                    <p className="text-gray-300">
                      Your monsters are stored on-chain as NFTs with full EVM compatibility, ensuring interoperability with other dApps.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card rounded-xl p-6 hover:border-game-accent/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3 mt-1 shadow-lg shadow-purple-500/20 animate-pulse-slow" style={{ animationDelay: '1s' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9" />
                      <path d="M13 2v7h7" />
                      <path d="m9 16 3-3 3 3" />
                      <path d="M9 19h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">On-Chain <span className="text-pink-400">Evolution</span></h3>
                    <p className="text-gray-300">
                      All monster evolutions and attribute changes are handled by smart contracts, ensuring fairness and transparency.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card rounded-xl p-6 hover:border-game-tertiary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3 mt-1 shadow-lg shadow-blue-500/20 animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M2 20h.01" />
                      <path d="M7 20v-4" />
                      <path d="M12 20v-8" />
                      <path d="M17 20V8" />
                      <path d="M22 4v16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Low <span className="text-cyan-400">Latency</span></h3>
                    <p className="text-gray-300">
                      Enjoy real-time battles and instant monster training updates thanks to Monad's high-performance blockchain.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card rounded-xl p-8 border-gradient">
              <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Your Journey?</h2>

              {!isConnected ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl mb-8 text-game-foreground/90"
                >
                  Connect your wallet to mint your first monster and begin your adventure
                </motion.p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button asChild size="lg" className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary-bright hover:to-game-secondary-bright text-white shadow-lg shadow-game-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-primary/30 hover:-translate-y-1">
                    <Link to="/monsters">View My Collection</Link>
                  </Button>
                  <Button asChild size="lg" className="bg-gradient-to-r from-game-accent to-game-tertiary hover:from-game-accent-bright hover:to-game-tertiary text-white shadow-lg shadow-game-accent/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-accent/30 hover:-translate-y-1">
                    <Link to="/battle">Enter Battle Arena</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="glass-dark py-6 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Link to="/about" className="text-game-primary-bright hover:text-game-secondary-bright transition-colors duration-300 text-lg">About</Link>
          </div>
          <p className="text-sm text-gray-400">
            MetaMonsters Arena © 2025 - Built on Monad Blockchain
          </p>
          <p className="text-xs text-gray-600 mt-2">
            All monsters are stored as NFTs on the blockchain.
            Contract: <span className="text-game-primary-bright">{import.meta.env.PROD ? '0x661d8753e6909ebbbeb0bd2551a0418b530ef1df' : '0x661d8753e6909ebbbeb0bd2551a0418b530ef1df'}</span>
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
