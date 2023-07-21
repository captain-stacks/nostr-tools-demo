import './App.css';
import { SimplePool } from 'nostr-tools'
import { useState } from 'react';

const pool = new SimplePool()

window.pool = pool
window.relays = [
  // your curated list of relays goes here!
].map(r => [r, {read: true, write: true}])

function App() {
  const [relays, setRelays] = useState(window.relays)

  async function findRelays() {
    let events = await pool.list(getAllRelays(), [{
      kinds: [3, 10_002],
      authors: [await window.nostr.getPublicKey()]
    }])
    events = events.filter(e => !(e.kind === 3 && !e.content)) // I forget to include this line in the video!
    events.sort((a, b) => b.created_at - a.created_at)
    let event = events[0]
    let relays = event.kind === 3
      ? Object.entries(JSON.parse(event.content))
      : event.tags
        .filter(t => t[0] === 'r')
        .map(t => [t[1], !t[2]
          ? {read: true, write: true}
          : {read: t[2] === 'read', write: t[2] === 'write'}])
    console.log(relays)
    console.log(event)
    setRelays(relays)
  }

  function getReadRelays() {
    return relays.filter(r => r[1].read).map(r => r[0])
  }

  function getWriteRelays() {
    return relays.filter(r => r[1].read).map(r => r[0])
  }

  function getAllRelays() {
    return relays.map(r => r[0])
  }

  window.getReadRelays = getReadRelays
  window.getWriteRelays = getWriteRelays
  window.getAllRelays = getAllRelays
  window.findRelays = findRelays

  return (
    <div className="App">
      <header className="App-header">
        {/* build your app here! */}
      </header>
    </div>
  );
}

export default App;
