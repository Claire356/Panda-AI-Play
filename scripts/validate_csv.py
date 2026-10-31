"""Validate an exported Panda Data CSV without reading any credentials.
Usage: python3 scripts/validate_csv.py sample.csv
Produces a normalized local JSON file for review, not automatic publication.
"""
import csv, json, sys, math
from pathlib import Path
rows=list(csv.DictReader(open(sys.argv[1],encoding='utf-8-sig')))
required={'date','open','high','low','close','volume'}
if not rows or not required.issubset(rows[0]):
    raise SystemExit('Required fields: date,open,high,low,close,volume')
seen=set()
for r in rows:
    if r['date'] in seen: raise SystemExit('Duplicate date; export one symbol only')
    seen.add(r['date'])
    for k in required-{'date'}:
        r[k]=float(r[k])
        if not math.isfinite(r[k]): raise SystemExit('Non-finite value')
    if min(r[k] for k in ['open','high','low','close'])<=0 or r['volume']<0: raise SystemExit('Invalid price/volume')
    if r['low']>min(r['open'],r['close']) or r['high']<max(r['open'],r['close']): raise SystemExit('Invalid OHLC')
rows.sort(key=lambda r:r['date'])
output=Path(sys.argv[1]).with_suffix('.validated.json')
output.write_text(json.dumps({'source':'user_export_pending_provenance_review','rows':rows},ensure_ascii=False,indent=2))
print(f'Validated {len(rows)} rows. Output: {output}. Confirm symbol, adjustment, date format and redistribution rights before use.')
