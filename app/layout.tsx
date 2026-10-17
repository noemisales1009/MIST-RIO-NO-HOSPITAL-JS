import type { Metadata } from "next";
export const metadata: Metadata = {title:"Mistério no Hospital JS",description:"Aprenda JavaScript jogando, investigue pistas e conecte seu aprendizado ao Supabase."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>}
