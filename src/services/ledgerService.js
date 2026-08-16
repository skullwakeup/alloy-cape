let ledger = [];

export function addEntry(entry) {
  ledger.unshift(entry);
}

export function getLedger() {
  return ledger;
}

export function clearLedger() {
  ledger = [];
}