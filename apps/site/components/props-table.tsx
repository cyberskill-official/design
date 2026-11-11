type Row = [name: string, type: string, defaultValue: string, description: string];

/** Compact props table for component pages: <PropsTable rows={[['variant', "'primary' | 'secondary'", "'primary'", 'Visual style']]} /> */
export function PropsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="not-prose my-5 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
        <thead>
          <tr style={{ background: 'var(--raised)' }}>
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
              <th key={h} scope="col" className="text-left" style={{ padding: '10px 12px', font: '600 11px/1.2 var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, def, desc]) => (
            <tr key={name} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 12px', font: '600 13px var(--font-mono)', whiteSpace: 'nowrap' }}>{name}</td>
              <td style={{ padding: '10px 12px', font: '13px var(--font-mono)', color: 'var(--accent-text)' }}>{type}</td>
              <td style={{ padding: '10px 12px', font: '13px var(--font-mono)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{def}</td>
              <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
