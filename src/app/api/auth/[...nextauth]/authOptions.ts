import { environments } from '@/constants/environments'
import { connectDatabase } from '@/lib/database'
import UserModel from '@/models/User'
import { SessionStrategy } from 'next-auth'

// Providers
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
  secret: environments.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // debug: process.env.NODE_ENV === 'development',
  providers: [
    // GOOGLE
    GoogleProvider({
      clientId: environments.GOOGLE_CLIENT_ID!,
      clientSecret: environments.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      console.log('- JWT -')

      if (trigger === 'update' && token.email) {
        console.log('- Update Token -')
        const userDB = await UserModel.findOne({
          email: token.email,
        }).lean()
        if (userDB) {
          return { ...token, ...userDB }
        }
      }

      if (user) {
        console.log('- User -')
        const userDB = await UserModel.findOne({
          email: user.email,
        }).lean()
        if (userDB) {
          token = { ...token, ...userDB }
        }

        return token
      }

      return token
    },

    async session({ session, token }: any) {
      console.log('- Session -')
      session.user = token

      return session
    },

    async signIn({ user, account, profile }: any) {
      console.log('- Sign In -')

      if (!user || !profile || !account || account.provider !== 'google') {
        return false
      }

      try {
        // connect to database
        await connectDatabase()

        // get user from database to check existence
        const existingUser: any = await UserModel.findOne({
          email: user.email,
          role: 'admin',
        }).lean()

        // check whether user exists
        if (existingUser) {
          return true
        }

        return false
      } catch (err: any) {
        console.log(err)
        return false
      }
    },
  },
}

export default authOptions
