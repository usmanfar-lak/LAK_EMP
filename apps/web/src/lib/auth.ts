import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    AzureADProvider({
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid profile email' } },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile }) {
      const roles = (profile as any)?.roles ?? (token as any).roles ?? []
      ;(token as any).roles = roles
      const oid = (profile as any)?.oid ?? (token as any).oid
      if (oid) (token as any).oid = oid
      return token
    },
    async session({ session, token }) {
      ;(session as any).roles = (token as any).roles ?? []
      ;(session as any).oid = (token as any).oid
      return session
    },
  },
})
