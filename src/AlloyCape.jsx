import React, { useState, useCallback } from "react";
import {
  Fingerprint, KeyRound, UploadCloud, Search, CheckCircle2,
  ShieldAlert, Users, Copy, AlertTriangle, Sparkles, ChevronRight
} from "lucide-react";

// ---------------------------------------------------------------------------
// Crypto + watermark helpers
// ---------------------------------------------------------------------------

// Demo-only secret. In a real deployment this lives server-side and is never
// shipped to the client.
const DEMO_SECRET = "alloy-cape-udaan2026-demo-secret";
const ZWS = "\u200B"; // zero-width space  -> bit 0
const ZWNJ = "\u200C"; // zero-width non-joiner -> bit 1
const FINGERPRINT_BITS = 16; // 16-bit fingerprint = 65,536 possible seeds

async function hmacHex(key, message) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBits(hex, nBits) {
  const bits = [];
  for (const ch of hex) {
    const v = parseInt(ch, 16);
    for (let i = 3; i >= 0; i--) bits.push((v >> i) & 1);
    if (bits.length >= nBits) break;
  }
  return bits.slice(0, nBits);
}

function bitsToHex(bits) {
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) {
    const nibble = bits.slice(i, i + 4);
    if (nibble.length < 4) break;
    hex += parseInt(nibble.join(""), 2).toString(16);
  }
  return hex;
}

// Weave the fingerprint bits into the document as zero-width characters,
// one per word boundary. Invisible on render, recoverable on extraction.
function embedWatermark(text, bits) {
  const words = text.split(" ");
  let bitIdx = 0;
  const out = words.map((w) => {
    if (bitIdx < bits.length) {
      const mark = bits[bitIdx] === 1 ? ZWNJ : ZWS;
      bitIdx += 1;
      return w + mark;
    }
    return w;
  });
  return out.join(" ");
}

function extractWatermark(text) {
  const found = [];
  for (const ch of text) {
    if (ch === ZWS) found.push(0);
    else if (ch === ZWNJ) found.push(1);
  }
  return found;
}

// Randomly drop some markers to simulate copy-paste / reformatting damage.
function simulateTamper(text, dropRate = 0.35) {
  let out = "";
  for (const ch of text) {
    if ((ch === ZWS || ch === ZWNJ) && Math.random() < dropRate) continue;
    out += ch;
  }
  return out;
}

// ---------------------------------------------------------------------------
// UI atoms
// ---------------------------------------------------------------------------

const Eyebrow = ({ children }) => (
  <div className="text-[11px] font-bold tracking-[0.2em] text-amber-400 mb-2">{children}</div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#242840] rounded-xl border border-[#343A56] p-6 ${className}`}>{children}</div>
);

const IconBadge = ({ icon: Icon, tone = "amber" }) => (
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
      tone === "amber" ? "bg-amber-400 text-[#1B1E2B]" : "bg-[#1B1E2B] text-amber-400"
    }`}
  >
    <Icon size={18} strokeWidth={2.25} />
  </div>
);

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

export default function AlloyCape() {
  const [tab, setTab] = useState("issue");
  const [ledger, setLedger] = useState([]);

  // Issue state
  const [docText, setDocText] = useState(
    "This memo outlines the Q3 roadmap and is intended only for the recipient named on this copy."
  );
  const [recipient, setRecipient] = useState("");
  const [sealed, setSealed] = useState(null);
  const [issuing, setIssuing] = useState(false);

  // Trace state
  const [leakedText, setLeakedText] = useState("");
  const [traceResult, setTraceResult] = useState(null);
  const [tracing, setTracing] = useState(false);

  const handleSeal = useCallback(async () => {
    if (!recipient.trim() || !docText.trim()) return;
    setIssuing(true);
    const timestamp = new Date().toISOString();
    const seedHex = await hmacHex(DEMO_SECRET, `${recipient}|${docText}|${timestamp}`);
    const bits = hexToBits(seedHex, FINGERPRINT_BITS);
    const fingerprint = bitsToHex(bits);
    const sealedText = embedWatermark(docText, bits);

    const entry = { id: crypto.randomUUID(), recipient, timestamp, fingerprint, docPreview: docText.slice(0, 60) };
    setLedger((prev) => [entry, ...prev]);
    setSealed({ sealedText, fingerprint, recipient });
    setIssuing(false);
  }, [recipient, docText]);

  const handleTrace = useCallback(
    (tamper = false) => {
      setTracing(true);
      const source = tamper ? simulateTamper(leakedText) : leakedText;
      const bits = extractWatermark(source);
      const recoveredHex = bitsToHex(bits);
      const recoveredCount = bits.length;

      let best = null;
      for (const entry of ledger) {
        const compareLen = Math.min(recoveredHex.length, entry.fingerprint.length);
        let matches = 0;
        for (let i = 0; i < compareLen; i++) {
          if (recoveredHex[i] === entry.fingerprint[i]) matches += 1;
        }
        const confidence = entry.fingerprint.length ? matches / entry.fingerprint.length : 0;
        if (!best || confidence > best.confidence) best = { entry, confidence };
      }

      setTraceResult({
        recoveredBits: recoveredCount,
        expectedBits: FINGERPRINT_BITS,
        match: best && best.confidence >= 0.75 ? best : null,
        candidate: best,
      });
      setTracing(false);
    },
    [leakedText, ledger]
  );

  return (
    <div className="min-h-screen w-full bg-[#1B1E2B] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#2E3350] p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
            <Fingerprint size={16} className="text-[#1B1E2B]" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-xl font-bold">Alloy Cape</span>
        </div>
        <p className="text-xs text-[#8A93A8] mb-8 leading-relaxed">
          Seed-based watermarking for leak attribution.
        </p>

        <nav className="space-y-1">
          <button
            onClick={() => setTab("issue")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "issue" ? "bg-amber-400 text-[#1B1E2B]" : "text-[#C7CCDA] hover:bg-[#242840]"
            }`}
          >
            <UploadCloud size={16} /> Issue a copy
          </button>
          <button
            onClick={() => setTab("trace")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "trace" ? "bg-amber-400 text-[#1B1E2B]" : "text-[#C7CCDA] hover:bg-[#242840]"
            }`}
          >
            <Search size={16} /> Trace a leak
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#2E3350]">
          <div className="flex items-center gap-2 text-[#8A93A8] text-xs mb-3">
            <Users size={13} /> ISSUE LEDGER ({ledger.length})
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {ledger.length === 0 && (
              <p className="text-xs text-[#5C6784]">No copies issued yet.</p>
            )}
            {ledger.map((e) => (
              <div key={e.id} className="text-xs bg-[#242840] rounded-lg px-3 py-2 border border-[#343A56]">
                <div className="font-semibold text-white truncate">{e.recipient}</div>
                <div className="text-[#8A93A8] font-mono">fp: {e.fingerprint}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 max-w-3xl">
        {tab === "issue" ? (
          <IssueView
            docText={docText}
            setDocText={setDocText}
            recipient={recipient}
            setRecipient={setRecipient}
            sealed={sealed}
            issuing={issuing}
            onSeal={handleSeal}
          />
        ) : (
          <TraceView
            leakedText={leakedText}
            setLeakedText={setLeakedText}
            traceResult={traceResult}
            tracing={tracing}
            onTrace={handleTrace}
            onUseSealed={() => sealed && setLeakedText(sealed.sealedText)}
            hasSealed={!!sealed}
          />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Issue tab
// ---------------------------------------------------------------------------

function IssueView({ docText, setDocText, recipient, setRecipient, sealed, issuing, onSeal }) {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <Eyebrow>ISSUE A COPY</Eyebrow>
      <h1 className="font-serif text-3xl font-bold mb-2">Seal a document for one recipient</h1>
      <p className="text-[#8A93A8] text-sm mb-8 max-w-xl">
        Every recipient gets a copy that reads identically to the original but carries a unique,
        invisible seed woven into it.
      </p>

      <Card className="mb-6">
        <label className="text-xs font-semibold text-[#C7CCDA] mb-2 block">RECIPIENT</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="e.g. jane.doe@company.com"
          className="w-full bg-[#1B1E2B] border border-[#343A56] rounded-lg px-3 py-2.5 text-sm mb-5 outline-none focus:border-amber-400"
        />

        <label className="text-xs font-semibold text-[#C7CCDA] mb-2 block">DOCUMENT CONTENT</label>
        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          rows={5}
          className="w-full bg-[#1B1E2B] border border-[#343A56] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none"
        />

        <button
          onClick={onSeal}
          disabled={issuing || !recipient.trim() || !docText.trim()}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#1B1E2B] font-semibold text-sm rounded-lg py-2.5 hover:bg-amber-300 transition-colors"
        >
          <KeyRound size={15} /> {issuing ? "Sealing…" : "Generate seed & seal copy"}
        </button>
      </Card>

      {sealed && (
        <Card className="border-amber-400/40">
          <div className="flex items-start gap-3 mb-4">
            <IconBadge icon={CheckCircle2} />
            <div>
              <div className="font-semibold text-sm">Sealed for {sealed.recipient}</div>
              <div className="text-xs text-[#8A93A8] font-mono">fingerprint: {sealed.fingerprint}</div>
            </div>
          </div>

          <label className="text-xs font-semibold text-[#C7CCDA] mb-2 block">
            SEALED COPY (visually identical — try pasting this into Trace)
          </label>
          <div className="bg-[#1B1E2B] border border-[#343A56] rounded-lg px-3 py-2.5 text-sm text-[#C7CCDA] mb-3 leading-relaxed">
            {sealed.sealedText}
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(sealed.sealedText);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-2 text-xs text-amber-400 font-semibold hover:text-amber-300"
          >
            <Copy size={13} /> {copied ? "Copied" : "Copy sealed text"}
          </button>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trace tab
// ---------------------------------------------------------------------------

function TraceView({ leakedText, setLeakedText, traceResult, tracing, onTrace, onUseSealed, hasSealed }) {
  return (
    <div>
      <Eyebrow>TRACE A LEAK</Eyebrow>
      <h1 className="font-serif text-3xl font-bold mb-2">Find out who a copy came from</h1>
      <p className="text-[#8A93A8] text-sm mb-8 max-w-xl">
        Paste a document that surfaced somewhere it shouldn't have. Alloy Cape recovers its
        embedded seed and matches it against the issue ledger.
      </p>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#C7CCDA] block">LEAKED TEXT</label>
          {hasSealed && (
            <button onClick={onUseSealed} className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Use last sealed copy
            </button>
          )}
        </div>
        <textarea
          value={leakedText}
          onChange={(e) => setLeakedText(e.target.value)}
          rows={5}
          placeholder="Paste the leaked document text here…"
          className="w-full bg-[#1B1E2B] border border-[#343A56] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-400 resize-none"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onTrace(false)}
            disabled={tracing || !leakedText.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#1B1E2B] font-semibold text-sm rounded-lg py-2.5 hover:bg-amber-300 transition-colors"
          >
            <Search size={15} /> {tracing ? "Tracing…" : "Trace source"}
          </button>
          <button
            onClick={() => onTrace(true)}
            disabled={tracing || !leakedText.trim()}
            className="flex items-center justify-center gap-2 border border-[#343A56] disabled:opacity-40 disabled:cursor-not-allowed text-[#C7CCDA] font-semibold text-sm rounded-lg py-2.5 px-4 hover:border-amber-400 transition-colors"
          >
            <ShieldAlert size={15} /> Simulate reformat damage
          </button>
        </div>
      </Card>

      {traceResult && (
        <Card>
          <div className="text-xs font-semibold text-[#C7CCDA] mb-3">
            RECOVERED {traceResult.recoveredBits} / {traceResult.expectedBits} SEED BITS
          </div>
          <div className="w-full h-2 bg-[#1B1E2B] rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${Math.min(100, (traceResult.recoveredBits / traceResult.expectedBits) * 100)}%` }}
            />
          </div>

          {traceResult.match ? (
            <div className="flex items-start gap-3">
              <IconBadge icon={CheckCircle2} />
              <div>
                <div className="font-semibold text-sm mb-1">
                  Traced to {traceResult.match.entry.recipient}
                </div>
                <div className="text-xs text-[#8A93A8]">
                  Confidence {(traceResult.match.confidence * 100).toFixed(0)}% · fingerprint{" "}
                  <span className="font-mono">{traceResult.match.entry.fingerprint}</span>
                </div>
              </div>
            </div>
          ) : traceResult.candidate && traceResult.candidate.confidence > 0 ? (
            <div className="flex items-start gap-3">
              <IconBadge icon={AlertTriangle} tone="dark" />
              <div>
                <div className="font-semibold text-sm mb-1">Low-confidence candidate only</div>
                <div className="text-xs text-[#8A93A8]">
                  Closest match: {traceResult.candidate.entry.recipient} at{" "}
                  {(traceResult.candidate.confidence * 100).toFixed(0)}% — below the attribution
                  threshold. Too much of the watermark was lost to confidently attribute this copy.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <IconBadge icon={AlertTriangle} tone="dark" />
              <div>
                <div className="font-semibold text-sm mb-1">No match found</div>
                <div className="text-xs text-[#8A93A8]">
                  No embedded seed was recovered, or no ledger entry matches it. Issue a copy first,
                  then trace it (or a tampered version of it) to see attribution in action.
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {!traceResult && (
        <div className="flex items-center gap-2 text-xs text-[#5C6784]">
          <Sparkles size={13} /> Tip: seal a copy in the Issue tab first, then paste it here to see a full-confidence trace.
        </div>
      )}
    </div>
  );
}
