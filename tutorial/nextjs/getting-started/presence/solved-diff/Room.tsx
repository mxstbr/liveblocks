import { useMyPresence } from "./liveblocks.config";

export function Room() {
  const [myPresence, updateMyPresence] = useMyPresence();

  return <div>JSON.stringify(myPresence)</div>;
}
