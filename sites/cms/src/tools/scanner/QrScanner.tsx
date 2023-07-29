import QrScannerEngine from 'qr-scanner'
import { useEffect, useRef } from 'react'

interface ScannerProps {
  onScan: (result: string) => void
}

export function QrScanner({ onScan }: ScannerProps) {
  const videoRef = useRef(null)
  const idRef = useRef<string | null>(null)
  const scanFunctionRef = useRef(onScan)

  useEffect(() => {
    scanFunctionRef.current = onScan
  }, [onScan])

  useEffect(() => {
    const qrScanner = new QrScannerEngine(
      videoRef.current,
      (qrCodeResult: QrScannerEngine.default.ScanResult) => {
        const id = qrCodeResult.data
        console.log('scanned ID', id)

        if (idRef.current !== id) {
          idRef.current = id
          scanFunctionRef.current(id)
        }
      },
      {
        returnDetailedScanResult: true,
        scanRegion: {
          x: 460,
          y: 40,
          width: 1000,
          height: 1000,
        },
      },
    ) as QrScannerEngine.default
    qrScanner.start()

    return () => qrScanner.destroy()
  }, [])

  return (
    <div
      style={{
        maxHeight: '50vh',
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: 1,
          objectFit: 'cover',
        }}
      />
    </div>
  )
}
