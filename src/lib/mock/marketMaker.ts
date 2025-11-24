
import { Token } from '@/types/token';

// Helper to generate random fake tokens
const generateId = () => Math.random().toString(36).substr(2, 9);
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const TOKENS_TO_GENERATE = 1000; // Let's stress test it with 1k rows

export class MarketMaker {
  private tokens: Map<string, Token> = new Map();

  constructor() {
    this.initializeMarket();
  }

  
  private initializeMarket() {
    const prefixes = ['W', 'A', 'Z', 'X', 'Q'];
    const roots = ['ETH', 'BTC', 'SOL', 'PEPE', 'DOGE', 'LINK', 'UNI'];
    
    for (let i = 0; i < TOKENS_TO_GENERATE; i++) {
      const symbol = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${roots[Math.floor(Math.random() * roots.length)]}`;
      const id = generateId();
      const price = randomRange(0.0001, 1000);

      this.tokens.set(id, {
        id,
        symbol,
        name: `${symbol} Protocol`,
        price,
        priceChange24h: randomRange(-15, 30),
        volume24h: randomRange(10000, 50000000),
        liquidity: randomRange(50000, 10000000),
        transactions: Math.floor(randomRange(100, 10000)),
        marketCap: price * randomRange(1000000, 1000000000),
        logoUrl: `https://avatar.vercel.sh/${symbol}.svg?text=${symbol.substring(0,2)}`,
        status: Math.random() > 0.8 ? 'new' : (Math.random() > 0.5 ? 'final-stretch' : 'migrated'),
      });
    }
  }

  getInitialData(): Token[] {
    return Array.from(this.tokens.values());
  }

   generateBatchUpdate(): Partial<Token>[] {
    const updates: Partial<Token>[] = [];
    const volatility = 0.02; // 2% max move per tick

     this.tokens.forEach((token) => {
      if (Math.random() > 0.9) {
     
        const change = 1 + (Math.random() * volatility * 2 - volatility);
        const newPrice = token.price * change;
        
        
        token.price = newPrice;
        token.priceChange24h += (change - 1) * 100;
        token.volume24h += randomRange(0, 1000);
        token.transactions += 1;

        updates.push({
          id: token.id,
          price: newPrice,
          priceChange24h: token.priceChange24h,
          volume24h: token.volume24h,
          transactions: token.transactions,
        });
      }
    });

    return updates;
  }
}