import { handleRoutingRequest } from '../../../handler.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return handleRoutingRequest(request);
}
