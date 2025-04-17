import { AppHeader } from '@/components/AppHeader';
import { motion } from 'framer-motion';

const About = () => {
  const technologies = [
    {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      color: "bg-blue-500"
    },
    {
      name: "TypeScript",
      description: "Typed JavaScript at any scale",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      color: "bg-blue-600"
    },
    {
      name: "Tailwind CSS",
      description: "A utility-first CSS framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
      color: "bg-teal-500"
    },
    {
      name: "Vite",
      description: "Next generation frontend tooling",
      icon: "https://vitejs.dev/logo.svg",
      color: "bg-purple-600"
    },
    {
      name: "shadcn/ui",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS",
      icon: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4",
      color: "bg-gray-800"
    },
    {
      name: "Monad Blockchain",
      description: "High-performance blockchain for gaming applications",
      icon: "https://placehold.co/100x100/4F46E5/FFFFFF?text=M",
      color: "bg-indigo-600"
    }
  ];

  const features = [
    {
      title: "Collect & Evolve",
      description: "Mint unique monsters with randomly generated attributes. Level up and evolve your monsters to increase their power.",
      icon: "🧬",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Battle",
      description: "Challenge other players' monsters in the battle arena. Win to earn experience and climb the rankings.",
      icon: "⚔️",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Trade",
      description: "Your monsters are NFTs on the Monad blockchain. Trade, sell, or gift them to other players.",
      icon: "💱",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Earn",
      description: "Participate in tournaments and special events to earn rewards and unique monster variants.",
      icon: "💎",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-game-background bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1494&q=80')] bg-cover bg-fixed">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-gray-900/80 to-black/90 backdrop-blur-[2px]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle-lg particle-1" style={{ top: '5%', left: '15%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0) 70%)', animationDuration: '30s' }}></div>
        <div className="particle-lg particle-2" style={{ top: '30%', right: '10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(79, 70, 229, 0) 70%)', animationDelay: '-8s', animationDuration: '25s' }}></div>
        <div className="particle-lg particle-3" style={{ bottom: '20%', left: '20%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)', animationDelay: '-15s', animationDuration: '35s' }}></div>
        <div className="particle-lg particle-4" style={{ bottom: '30%', right: '25%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.3) 0%, rgba(217, 70, 239, 0) 70%)', animationDelay: '-20s', animationDuration: '40s' }}></div>
        <div className="particle-lg particle-5" style={{ top: '50%', left: '50%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 70%)', animationDelay: '-12s', animationDuration: '45s' }}></div>
      </div>

      <AppHeader />

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            <span className="text-white">About Meta</span><span className="text-game-primary-bright">Monsters</span> <span className="text-white">Arena</span>
          </h1>

          <div className="glass-card rounded-xl p-8 mb-12 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 text-game-primary">Our Vision</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              MetaMonsters Arena is a blockchain-based monster battling game built for the Monad Hackathon.
              Our vision is to create an engaging, strategic game that leverages the power of blockchain
              technology to provide true ownership of in-game assets and a transparent, fair gaming experience.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-4">
              Players can collect, evolve, and battle with their unique monsters, each represented as an NFT
              on the Monad blockchain. The game combines strategic gameplay with the excitement of collecting
              and trading digital assets.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-4 border-l-4 border-game-primary-bright pl-4">
              <span className="text-game-primary-bright font-semibold">Coming in the next version:</span> We're excited to announce that our upcoming release will introduce a variety of new NFT monsters with unique abilities and rare attributes. Players will be able to compete against randomly matched opponents from around the world in our enhanced Battle Arena, featuring seasonal tournaments with exclusive rewards. Our matchmaking system will ensure balanced and exciting gameplay while creating opportunities for players to climb the global rankings and showcase their strategic skills.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Key <span className="text-game-primary-bright">Features</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            <span className="text-game-secondary-bright">Technologies</span> Used
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 flex flex-col items-center text-center hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-2 text-white">{tech.name}</h3>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-game-primary">About the Hackathon</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              This project was created for the Monad Blockchain Hackathon, showcasing the capabilities
              of the Monad blockchain for gaming applications. This project aims to demonstrate how blockchain
              technology can enhance gaming experiences by providing true ownership, transparency, and
              new economic models for players.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mt-4">
              The hackathon challenged participants to build innovative applications that leverage Monad's
              high-performance blockchain infrastructure. MetaMonsters Arena is presented as an individual
              submission to showcase these capabilities.
            </p>
          </div>


        </motion.div>
      </main>

      <footer className="glass-dark py-6 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="/" className="text-game-primary-bright hover:text-game-secondary-bright transition-colors duration-300">Home</a>
            <span className="text-gray-600">|</span>
            <a href="/monsters" className="text-game-secondary-bright hover:text-game-accent-bright transition-colors duration-300">My Monsters</a>
            <span className="text-gray-600">|</span>
            <a href="/battle" className="text-game-accent-bright hover:text-game-tertiary transition-colors duration-300">Battle Arena</a>
          </div>
          <p className="text-sm text-gray-400">
            MetaMonsters Arena © 2025 - Built on Monad Blockchain
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Created for the Monad Blockchain Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
