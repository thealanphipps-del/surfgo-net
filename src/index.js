// SURFGO_GENESIS_CORE v8.0 (The 195 Lock & Encrypted Vault)
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const SUPPLY_CAP = 195;

    // Simulated edge-encryption wrapper
    const encryptAtEdge = (text, key) => {
        return "AES_WRAPPED_[" + btoa(text + key).split("").reverse().join("") + "]";
    };

    if (request.method === "GET") {
      const currentCountStr = await env.WAITING_LIST.get("FOUNDERS_COUNT") || "0";
      const currentCount = parseInt(currentCountStr);
      const remaining = SUPPLY_CAP - currentCount;

      if (remaining <= 0) {
        return new Response("<body style='background:#000;color:#f00;font-family:monospace;'><h1 align='center'>FOUNDERS_CLUB_CLOSED</h1></body>", { headers: { "Content-Type": "text/html" } });
      }

      return new Response(`
        <body style="background:#000; color:#fff; font-family:monospace; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center;">
          <h1 style="letter-spacing:15px; color:#a9a9a9;">SURFGO.NET</h1>
          <p style="color:#0ff;">[ FOUNDERS_CLUB : COBALT-CHROME TIER ]</p>
          <div style="border:1px solid #333; padding:30px; width:350px; background:#050505;">
            <p style="font-size:1.5em; color:#a9a9a9;">SLOTS_REMAINING: ${remaining}</p>
            <p style="font-size:0.8em;">GEOMETRIC_PEG: $19.50</p>
            <form action="/procure" method="POST">
              <input type="text" name="alias" placeholder="ENTER_NODE_ALIAS" required style="width:100%; padding:10px; background:#000; border:1px solid #0ff; color:#fff; margin:10px 0;">
              <button style="width:100%; padding:15px; background:#a9a9a9; color:#000; font-weight:bold; border:none; cursor:pointer;">SECURE_HULL_ID</button>
            </form>
          </div>
        </body>`, { headers: { "Content-Type": "text/html" } });
    }

    if (request.method === "POST" && pathname === "/procure") {
      const currentCountStr = await env.WAITING_LIST.get("FOUNDERS_COUNT") || "0";
      let currentCount = parseInt(currentCountStr);
      
      if (currentCount >= SUPPLY_CAP) return new Response("CAPACITY_EXCEEDED", { status: 403 });

      const formData = await request.formData();
      const nodeAlias = formData.get("alias") || "FOUNDER_NODE";
      
      const words = ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual"];
      const mnemonic = Array.from({length: 12}, () => words[Math.floor(Math.random() * words.length)]).join(" ");

      currentCount++;
      const hull_id = `SGO-C-${currentCount.toString().padStart(3, '0')}`;
      const encryptedSeed = encryptAtEdge(mnemonic, env.SOVEREIGN_ROOT_KEY || "GENESIS_KEY");

      // LOG TO LEDGER
      await env.WAITING_LIST.put(nodeAlias, JSON.stringify({
        hull_id: hull_id,
        encrypted_mnemonic: encryptedSeed,
        timestamp: new Date().toISOString(),
        tier: "FOUNDERS_COBALT"
      }));
      await env.WAITING_LIST.put("FOUNDERS_COUNT", currentCount.toString());

      return new Response(`
        <body style="background:#000; color:#fff; font-family:monospace; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center;">
          <h2 style="color:#a9a9a9;">HULL_ID_SECURED: ${hull_id}</h2>
          <div style="border:2px solid #a9a9a9; padding:25px; font-size:1.5em; background:#111; max-width:500px; color:#0ff;">
            ${mnemonic}
          </div>
          <p style="margin-top:20px; color:#f00; font-size:0.7em;">RECORD YOUR SEED. YOUR COBALT-CHROME CLAMSHELL IS PENDING.</p>
        </body>`, { headers: { "Content-Type": "text/html" } });
    }
  }
};
