import { MarketMaker } from '../mock/marketMaker';
import { WorkerMessage, MainThreadMessage } from '@/types/token';


const market = new MarketMaker();
let intervalId: NodeJS.Timeout | null = null;
let updateSpeed = 1000; // Default 1s


self.onmessage = (e: MessageEvent<MainThreadMessage>) => {
  const { type } = e.data;

  switch (type) {
    case 'START_CONNECTION':
      // 1. Send initial load instantly
      const initialData = market.getInitialData();
      postMessage({ type: 'INIT_DATA', payload: initialData } as WorkerMessage);

      // 2. Start the heartbeat
      if (!intervalId) {
        intervalId = setInterval(() => {
          const updates = market.generateBatchUpdate();
          postMessage({ type: 'UPDATE_BATCH', payload: updates } as WorkerMessage);
        }, updateSpeed);
      }
      break;

    case 'STOP_CONNECTION':
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      break;
      
    case 'UPDATE_CONFIG':
      if (e.data.payload.speed === 'fast') updateSpeed = 100;
      else updateSpeed = 1000;
      // Restart interval with new speed logic (simplified here)
      break;
  }
};

