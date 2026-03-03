import { ConfidentialClientApplication } from '@azure/msal-node'

const cca = new ConfidentialClientApplication({
  auth: {
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  },
})

async function getToken() {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  })
  if (!result?.accessToken) throw new Error('Unable to acquire Graph token')
  return result.accessToken
}

function parseHrCc(): string[] {
  return (process.env.HR_CC_EMAILS || '')
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function sendMail(params: { to: string[]; subject: string; html: string; cc?: string[] }) {
  const token = await getToken()
  const sender = process.env.MAIL_SENDER_UPN!
  const cc = [...parseHrCc(), ...(params.cc ?? [])]

  const payload = {
    message: {
      subject: params.subject,
      body: { contentType: 'HTML', content: params.html },
      toRecipients: params.to.map((address) => ({ emailAddress: { address } })),
      ccRecipients: cc.map((address) => ({ emailAddress: { address } })),
    },
    saveToSentItems: true,
  }

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Graph sendMail failed: ${res.status} ${text}`)
  }
}
