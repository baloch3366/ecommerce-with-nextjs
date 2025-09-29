import  bcrypt  from 'bcryptjs';
import Credentials  from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "./auth.config" 
import client from './lib/db/client';
import Google from "next-auth/providers/google"
import { ConnectToDatabase } from './lib/db';
import User from './lib/db/model/user.model';
// extend Session type
declare module 'next-auth' {
    interface Session {
        user : {
            id: string,
            role: string
        } & DefaultSession['user']
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
      secret: process.env.AUTH_SECRET,
    ...authConfig,
    pages: {
        signIn: '/signIn',
        newUser: '/signUp',
        error: '/signIn'
    },
    session:{
        strategy:'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: MongoDBAdapter(client),
    providers:[
        // Google({
        //  allowDangerousEmailAccountLinking: true
        // }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: "openid email profile",
            },
            },
            // profile(profile) {
            // return {
            //     id: profile.sub,
            //     name: profile.name,
            //     email: profile.email,
            //     image: profile.picture || null,
            //     role: "user", // Default role
            // }
            // },
            // checks: ["pkce", "state"],
             }),

           Credentials({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", type: 'email'},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                await ConnectToDatabase();
                if(!credentials?.email || !credentials?.password) return null;
                const user = await User.findOne({email: credentials.email})
                if(!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password.toString(),user.password);

                if(!isValid) return null;

                return{
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user'

                }

            }
        }),
    ],
    callbacks:{
        //Login control
        async signIn({account}) {
            // Allow all non-credentials providers (e.g google)
            if(account?.provider !== "credentials") return true;
            return true // Allow signin
        },

        async jwt({token,user,trigger,session }){
          // First-time sign-in: attach user info to token
            if(user) {
                token.id = user.id;
                token.role = (user as {role?: string}).role || 'user';
                token.name = user.name || user.email!.split('@')[0];

                //ensure Db has proper name and role
                if(!user.name){
                    await ConnectToDatabase()
                    await User.findByIdAndUpdate(user.id,{
                        name:token.name,
                        role: token.role,
                    })
                }

             }
              // Handle profile update from client
                if(trigger === "update" && session?.user){
                   token.name = session.user.name;
                   if(session.user.role){
                    token.role = session.user.role;
                   }

                }

        return token;
        },
        // session handling(map token session)

        async session({session, token}) {
            if(session.user){
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    events: {
     // Runs only once when a user is created
     async createUser({user}){
        await ConnectToDatabase();
        await User.findByIdAndUpdate(user.id,{
            name: user.name || user.email?.split("@")[0],
            role: (user as {role?:string}).role || 'user'
        })
     }
    }
})