// src/hooks/useSocketWorker.ts
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setInitialData, updateTokenBatch } from '@/lib/store/tokenSlice';
import { WorkerMessage } from '@/types/token';

export const useSocketWorker = () => {
  const dispatch = useAppDispatch();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // 1. Initialize the Worker
    // The "import.meta.url" magic tells Next.js exactly where to bundle this file relative to here.
    workerRef.current = new Worker(
      new URL('../lib/workers/socket.worker.ts', import.meta.url)
    );

    // 2. Listen for messages from the Engine
    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, payload } = event.data;

      if (type === 'INIT_DATA') {
        // Full replacement (initial load)
        dispatch(setInitialData(payload));
      } else if (type === 'UPDATE_BATCH') {
        // Delta updates (the performance magic)
        dispatch(updateTokenBatch(payload));
      }
    };

    // 3. Start the engine
    workerRef.current.postMessage({ type: 'START_CONNECTION' });

    // 4. Cleanup on unmount (stop the worker to save memory)
    return () => {
      workerRef.current?.postMessage({ type: 'STOP_CONNECTION' });
      workerRef.current?.terminate();
    };
  }, [dispatch]);
};