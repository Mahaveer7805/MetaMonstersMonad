import { ethers } from "ethers";
import { toast } from "sonner";

// Contract ABI and address
const METAMONSTERS_CONTRACT_ADDRESS = "0x661d8753e6909ebbbeb0bd2551a0418b530ef1df";

const METAMONSTERS_ABI = [
  "function mintPet(string name, uint256 dna) public",
  "function getPet(uint256 tokenId) public view returns (string name, uint256 level, uint256 dna)",
  "function levelUp(uint256 tokenId) public",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenByIndex(uint256 index) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)"
];

export interface Pet {
  id: number;
  name: string;
  level: number;
  dna: bigint;
  owner: string;
  type: string;
  attributes: {
    strength: number;
    speed: number;
    intelligence: number;
    stamina: number;
  };
  image: string;
}

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  address: string;
  chainId: number;
  isConnected: boolean;
}

// Initialize empty state
let web3State: Web3State = {
  provider: null,
  signer: null,
  contract: null,
  address: "",
  chainId: 0,
  isConnected: false,
};

// Monad Chain Configuration
const MONAD_CHAIN_ID = 10143; // Updated Chain ID for Monad testnet (as decimal)
const MONAD_CHAIN_ID_HEX = "0x279f"; // Updated Chain ID for Monad testnet (in hex)
const MONAD_CHAIN_CONFIG = {
  chainId: MONAD_CHAIN_ID_HEX,
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MONAD",
    symbol: "MON", // Updated symbol
    decimals: 18
  },
  rpcUrls: ["https://rpc.testnet.monad.xyz/"],
  blockExplorerUrls: ["https://explorer.testnet.monad.xyz/"]
};

// Event callbacks
const eventCallbacks = {
  onAccountsChanged: new Set<(address: string) => void>(),
  onChainChanged: new Set<(chainId: number) => void>(),
  onConnect: new Set<(info: { address: string; chainId: number }) => void>(),
  onDisconnect: new Set<() => void>(),
};

// Switch to Monad network
const switchToMonadNetwork = async (provider: ethers.BrowserProvider) => {
  try {
    console.log("Attempting to switch to Monad network with chainId:", MONAD_CHAIN_ID_HEX);

    // Try to switch to the Monad chain
    await provider.send("wallet_switchEthereumChain", [
      { chainId: MONAD_CHAIN_ID_HEX }
    ]);
    console.log("Successfully switched to Monad network");
    return true;
  } catch (switchError: any) {
    console.error("Error switching to Monad chain:", switchError);

    // Check for various error codes that indicate the chain hasn't been added
    const errorCode = switchError?.code ||
                     switchError?.error?.code ||
                     (switchError?.message && switchError.message.includes("Unrecognized chain ID") ? 4902 : 0);

    if (errorCode === 4902 ||
        switchError?.message?.includes("Unrecognized chain ID") ||
        switchError?.message?.includes("wallet_addEthereumChain")) {
      try {
        console.log("Adding Monad network to wallet with config:", MONAD_CHAIN_CONFIG);
        await provider.send("wallet_addEthereumChain", [MONAD_CHAIN_CONFIG]);
        console.log("Monad network added successfully");

        // After adding the chain, try to switch to it
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: MONAD_CHAIN_ID_HEX }
          ]);
          console.log("Successfully switched to Monad network after adding");
          return true;
        } catch (secondSwitchError) {
          console.error("Error switching to Monad after adding:", secondSwitchError);
          toast.warning("Please manually select the Monad network in your wallet");
          return false;
        }
      } catch (addError) {
        console.error("Error adding Monad chain:", addError);
        toast.error("Failed to add Monad network. Please add it manually to your wallet.");

        // Provide instructions for manual addition
        toast.info("To add manually: Network Name: Monad Testnet, RPC URL: https://rpc.testnet.monad.xyz/, Chain ID: 10143, Symbol: MONAD", {
          duration: 10000,
        });

        return false;
      }
    } else {
      toast.warning("Please switch to Monad network manually in your wallet");
      toast.info("Network Name: Monad Testnet, RPC URL: https://rpc.testnet.monad.xyz/, Chain ID: 10143, Symbol: MONAD", {
        duration: 8000,
      });
      return false;
    }
  }
};

// Connect to wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    toast.error("Please install MetaMask to use this feature");
    return false;
  }

  try {
    console.log("Initializing provider...");
    // Initialize ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Request accounts
    console.log("Requesting accounts...");
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length === 0) {
      toast.error("No accounts found");
      return false;
    }

    // Get current network
    console.log("Getting current network...");
    const network = await provider.getNetwork();
    console.log("Current network:", network);

    // Check if we need to switch networks
    const currentChainId = Number(network.chainId);
    console.log(`Current chain ID: ${currentChainId} (${MONAD_CHAIN_ID} expected)`);

    let networkSwitchSuccess = true;
    if (currentChainId !== MONAD_CHAIN_ID) {
      console.log("Need to switch to Monad network");
      networkSwitchSuccess = await switchToMonadNetwork(provider);
    }

    const address = accounts[0];
    console.log("Connected address:", address);

    let signer;
    try {
      signer = await provider.getSigner();
    } catch (signerError) {
      console.error("Error getting signer:", signerError);
      if (!networkSwitchSuccess) {
        // If we couldn't switch networks properly, try to continue anyway
        // but warn the user they should switch manually
        toast.warning("Please make sure you're connected to Monad network for full functionality");
      }
      return false;
    }

    const chainId = Number(network.chainId);

    // Initialize contract instance
    console.log("Initializing contract...");
    const contract = new ethers.Contract(
      METAMONSTERS_CONTRACT_ADDRESS,
      METAMONSTERS_ABI,
      signer
    );

    // Update state
    web3State = {
      provider,
      signer,
      contract,
      address,
      chainId: networkSwitchSuccess ? MONAD_CHAIN_ID : chainId, // Use expected chain ID if switch succeeded
      isConnected: true,
    };

    // Notify about successful connection
    console.log("Successfully connected to wallet");
    eventCallbacks.onConnect.forEach((callback) =>
      callback({ address, chainId: web3State.chainId })
    );

    // Listen for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return networkSwitchSuccess;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    toast.error("Failed to connect wallet");
    return false;
  }
};

// Disconnect wallet
export const disconnectWallet = async () => {
  if (!web3State.isConnected) return;

  // Remove listeners
  if (window.ethereum) {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    window.ethereum.removeListener("chainChanged", handleChainChanged);
    window.ethereum.removeListener("disconnect", handleDisconnect);
  }

  // Reset state
  web3State = {
    provider: null,
    signer: null,
    contract: null,
    address: "",
    chainId: 0,
    isConnected: false,
  };

  // Notify about disconnection
  eventCallbacks.onDisconnect.forEach((callback) => callback());

  toast.success("Wallet disconnected");
};

// Handler for accounts changed
const handleAccountsChanged = (accounts: string[]) => {
  if (accounts.length === 0) {
    // User disconnected
    disconnectWallet();
  } else {
    // Update current address
    web3State.address = accounts[0];
    eventCallbacks.onAccountsChanged.forEach((callback) =>
      callback(accounts[0])
    );
  }
};

// Handler for chain changed
const handleChainChanged = (chainId: string) => {
  const numericChainId = parseInt(chainId, 16);
  web3State.chainId = numericChainId;
  eventCallbacks.onChainChanged.forEach((callback) =>
    callback(numericChainId)
  );

  // Force reload to ensure everything is in sync
  window.location.reload();
};

// Handler for disconnect
const handleDisconnect = () => {
  disconnectWallet();
};

// Subscribe to events
export const subscribeToEvents = (events: {
  onConnect?: (info: { address: string; chainId: number }) => void;
  onDisconnect?: () => void;
  onAccountsChanged?: (address: string) => void;
  onChainChanged?: (chainId: number) => void;
}) => {
  if (events.onConnect) eventCallbacks.onConnect.add(events.onConnect);
  if (events.onDisconnect) eventCallbacks.onDisconnect.add(events.onDisconnect);
  if (events.onAccountsChanged) eventCallbacks.onAccountsChanged.add(events.onAccountsChanged);
  if (events.onChainChanged) eventCallbacks.onChainChanged.add(events.onChainChanged);

  // Return unsubscribe function
  return () => {
    if (events.onConnect) eventCallbacks.onConnect.delete(events.onConnect);
    if (events.onDisconnect) eventCallbacks.onDisconnect.delete(events.onDisconnect);
    if (events.onAccountsChanged) eventCallbacks.onAccountsChanged.delete(events.onAccountsChanged);
    if (events.onChainChanged) eventCallbacks.onChainChanged.delete(events.onChainChanged);
  };
};

// Get current connection state
export const getConnectionState = () => {
  return {
    address: web3State.address,
    chainId: web3State.chainId,
    isConnected: web3State.isConnected,
  };
};

// Contract interaction methods
export const mintPet = async (name: string, dna: number) => {
  if (!web3State.contract || !web3State.signer) {
    toast.error("Wallet not connected");
    return null;
  }

  try {
    // Check if we're on the right network
    if (web3State.chainId !== MONAD_CHAIN_ID) {
      toast.warning(`Please connect to the Monad network to mint monsters. Current Chain ID: ${web3State.chainId}`);
      const switched = await switchToMonadNetwork(web3State.provider!);
      if (!switched) {
        toast.error("Please switch to Monad network manually to continue");
        return null;
      }

      // Refresh signer after network switch
      if (web3State.provider) {
        try {
          web3State.signer = await web3State.provider.getSigner();
          web3State.contract = new ethers.Contract(
            METAMONSTERS_CONTRACT_ADDRESS,
            METAMONSTERS_ABI,
            web3State.signer
          );
        } catch (error) {
          console.error("Error getting signer after network switch:", error);
          toast.error("Please make sure you're connected to Monad network");
          return null;
        }
      }
    }

    console.log("Minting pet with name:", name, "and DNA:", dna);
    const tx = await web3State.contract.mintPet(name, dna);
    toast.info("Minting your monster on Monad blockchain... Please wait for confirmation");
    await tx.wait();
    toast.success(`Successfully minted ${name} on Monad blockchain!`);
    return tx.hash;
  } catch (error) {
    console.error("Error minting pet:", error);
    toast.error("Failed to mint monster. Please make sure you're connected to Monad network.");
    return null;
  }
};

export const levelUpPet = async (tokenId: number) => {
  if (!web3State.contract || !web3State.signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await web3State.contract.levelUp(tokenId);
    toast.info("Leveling up your monster... Please wait for confirmation");
    await tx.wait();
    toast.success("Monster leveled up!");
    return true;
  } catch (error) {
    console.error("Error leveling up pet:", error);
    toast.error("Failed to level up monster");
    return false;
  }
};

export const getUserPets = async () => {
  if (!web3State.contract || !web3State.address) {
    return [];
  }

  try {
    // Get user's token balance
    const balance = await web3State.contract.balanceOf(web3State.address);

    // Get all token IDs owned by the user
    const pets: Pet[] = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await web3State.contract.tokenOfOwnerByIndex(web3State.address, i);
      const pet = await getPet(Number(tokenId));
      if (pet) {
        pets.push(pet);
      }
    }

    return pets;
  } catch (error) {
    console.error("Error fetching user pets:", error);
    return [];
  }
};

export const getPet = async (tokenId: number) => {
  if (!web3State.contract) {
    return null;
  }

  try {
    const [name, level, dna] = await web3State.contract.getPet(tokenId);
    const owner = await web3State.contract.ownerOf(tokenId);

    // Generate pet attributes based on DNA
    const dnaBigInt = BigInt(dna);
    const attributes = generateAttributes(dnaBigInt);

    // Determine monster type based on DNA
    const monsterType = determineMonsterType(dnaBigInt);

    return {
      id: tokenId,
      name,
      level: Number(level),
      dna: dnaBigInt,
      owner,
      type: monsterType,
      attributes,
      image: `/monsters/${monsterType.toLowerCase()}_${(Number(level) > 5 ? 2 : 1)}.png`
    } as Pet;
  } catch (error) {
    console.error(`Error fetching pet #${tokenId}:`, error);
    return null;
  }
};

export const getAllPets = async () => {
  if (!web3State.contract) {
    return [];
  }

  try {
    // Get total supply
    const totalSupply = await web3State.contract.totalSupply();

    // Get all pets
    const pets: Pet[] = [];

    for (let i = 0; i < Number(totalSupply); i++) {
      const tokenId = await web3State.contract.tokenByIndex(i);
      const pet = await getPet(Number(tokenId));
      if (pet) {
        pets.push(pet);
      }
    }

    return pets;
  } catch (error) {
    console.error("Error fetching all pets:", error);
    return [];
  }
};

// Helper functions for generating monster attributes and types
function generateAttributes(dna: bigint) {
  // Extract attributes from different parts of the DNA
  const strengthBase = Number(dna & BigInt(0xFF));
  const speedBase = Number((dna >> BigInt(8)) & BigInt(0xFF));
  const intelligenceBase = Number((dna >> BigInt(16)) & BigInt(0xFF));
  const staminaBase = Number((dna >> BigInt(24)) & BigInt(0xFF));

  // Normalize to a scale of 1-100
  return {
    strength: Math.max(10, Math.min(100, Math.floor(strengthBase / 2.55))),
    speed: Math.max(10, Math.min(100, Math.floor(speedBase / 2.55))),
    intelligence: Math.max(10, Math.min(100, Math.floor(intelligenceBase / 2.55))),
    stamina: Math.max(10, Math.min(100, Math.floor(staminaBase / 2.55))),
  };
}

function determineMonsterType(dna: bigint) {
  // Use the last few bits to determine type
  const typeValue = Number(dna & BigInt(0xF));

  // Map to monster types
  const types = ["Fire", "Water", "Earth", "Air", "Electric"];
  return types[typeValue % types.length];
}

// Add ethers to window type
declare global {
  interface Window {
    ethereum: any;
  }
}
