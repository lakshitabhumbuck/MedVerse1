

import { Xendit } from 'xendit-node'

// Validate Xendit API key format
const validateXenditKey = (apiKey) => {
  if (!apiKey) {
    throw new Error('XENDIT_API_KEY environment variable is not set')
  }
  
  if (!apiKey.startsWith('xnd_')) {
    throw new Error('Invalid Xendit API key format. API key must start with "xnd_"')
  }
  
  return apiKey
}

const xenditClient = new Xendit({
  secretKey: validateXenditKey(process.env.XENDIT_API_KEY)
})
 
export default xenditClient 
