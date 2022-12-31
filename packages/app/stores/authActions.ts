import { createMnemonic, keypairFromSeed, seedFromWords } from 'app/lib/nostr'
import { AuthState, initialState } from './auth'

export const login = (name: string): AuthState => {
  const mnemonic = createMnemonic()
  const seed = seedFromWords(mnemonic)
  console.log(mnemonic, seed)
  const { privateKey, publicKey } = keypairFromSeed(seed)
  console.log(privateKey, publicKey)

  return {
    isLoggedIn: true,
    user: {
      name,
    },
  }
}

export const logout = (): AuthState => {
  return initialState
}
