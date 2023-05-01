export function ProgressBar({ amount, total }: { amount: number; total: number }) {
  const width = amount && total ? (amount / total) * 100 : 0
  const background = width > 80 ? 'limegreen' : width > 50 ? 'yellow' : 'red'

  return (
    <div
      style={{
        width: '100%',
        height: '5px',
        background: 'black',
        borderRadius: '2px',
      }}
    >
      <div style={{ width: `${width}%`, height: '5px', background, borderRadius: '2px' }}></div>
    </div>
  )
}
