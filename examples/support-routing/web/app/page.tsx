import { routingMode } from '../handler.mjs';
import RoutingDesk from './routing-desk';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <RoutingDesk mode={routingMode() as 'fixture' | 'live'} />;
}
