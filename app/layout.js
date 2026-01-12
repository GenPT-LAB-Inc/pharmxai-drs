import './globals.css'

export const metadata = {
  title: 'PharmxAI - Invoice Management',
  description: 'AI-powered pharmaceutical invoice management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

