import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './responsive.css'
import {Space_Grotesk, Bebas_Neue} from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ['latin'] })

const space = Space_Grotesk({
  subsets:['latin-ext'],
  weight:['300','400','700'],
  variable:'--font-space'
})


export const metadata: Metadata = {
  title: 'Algotron 2025',
  description: 'Algotron 2025 is a cutting-edge platform that revolutionizes the way you interact with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${space.variable}`}>
      <body className={`${inter.className} bg-[#030014] overflow-y-auto overflow-x-hidden `}>{children}</body>
    </html>
    </ClerkProvider>
  )
}
