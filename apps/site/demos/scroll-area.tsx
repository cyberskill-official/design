'use client';
import { ScrollArea } from '@cyberskill/design';

const box = { height: 200, width: '100%', maxWidth: 360, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' };
const notes = Array.from({ length: 16 }, (_, i) => `Version 3.${16 - i}: faster replies, fewer retries and clearer error messages.`);
const regions = ['ap-southeast-1', 'ap-northeast-1', 'eu-central-1', 'us-east-1', 'us-west-2', 'sa-east-1', 'me-central-1'];

export function ScrollAreaVertical() {
  return (
    <ScrollArea label="Release notes" style={box}>
      <div className="cs-ui" style={{ padding: '12px 16px', display: 'grid', gap: 8 }}>
        {notes.map((n) => <p key={n} style={{ margin: 0 }}>{n}</p>)}
      </div>
    </ScrollArea>
  );
}

export function ScrollAreaBoth() {
  return (
    <ScrollArea label="Usage by region" style={box}>
      <table className="cs-ui" style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
        <thead>
          <tr>{['Region', 'Messages', 'Avg. latency', 'Errors', 'Cost (VND)'].map((h) => <th key={h} scope="col" style={{ textAlign: 'start', padding: '10px 16px' }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {regions.map((r, i) => (
            <tr key={r} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)' }}>{r}</td>
              <td style={{ padding: '10px 16px' }}>{(12840 - i * 1310).toLocaleString('en')}</td>
              <td style={{ padding: '10px 16px' }}>{320 + i * 40} ms</td>
              <td style={{ padding: '10px 16px' }}>{i}</td>
              <td style={{ padding: '10px 16px' }}>{(1840000 - i * 150000).toLocaleString('en')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
