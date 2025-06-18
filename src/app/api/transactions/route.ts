import classifyTransaction from '@/lib/classify-transaction';
import type { Block, Transaction } from '@/types';
import axios from 'axios';
import { NextRequest } from 'next/server';

const rpcUrl = process.env.RPC_URL || 'https://testnet-rpc.monad.xyz';
const pollingInterval = parseInt(process.env.POLLING_INTERVAL || '1000') ;

const subscribers = new Set<(txs: Transaction[]) => void>();
let lastProcessedBlock = 0;
let isPolling = false;

async function pollBlock() {
  // Prevent multiple polling processes
  if (isPolling) return;
  isPolling = true;

  const poll = async () => {
    try {
      // Request the latest block
      const response = await axios.post<{ result: Block }>(rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['latest', true],
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const block = response.data.result;

      if (!block || !block.number) return;

      const blockNumber = parseInt(block.number, 16);

      // Only process if this is a new block
      if (blockNumber > lastProcessedBlock) {
        lastProcessedBlock = blockNumber;

        // Classify transaction type
        const txs = block.transactions.map((tx) => ({
          ...tx,
          type: classifyTransaction(tx.input),
        }));

        // Broadcast new transactions
        for (const subscriber of subscribers) {
          subscriber(txs);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown';
      console.error('Polling error:', errorMessage);
    }

    setTimeout(poll, pollingInterval);
  };

  poll();
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let isClientConnected = true;

  // ensure polling is active
  pollBlock();

  const stream = new ReadableStream({
    start(controller) {
      // Function to send transactions to this specific client
      const send = (txs: Transaction[]) => {
        if (!isClientConnected) return;
        const data = `data: ${JSON.stringify(txs)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      // Register this client's callback
      subscribers.add(send);

      // Clean up when the client disconnect
      req.signal.addEventListener('abort', () => {
        isClientConnected = false;
        subscribers.delete(send);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Prevents proxy servers from buffering the response
    },
  });
}
