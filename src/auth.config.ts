// import type { NextAuthOptions } from 'next-auth';
 

// export default {
//     providers:[],
//     callbacks: {
//         authorized({ request, auth }) {
//             const protectedPaths = [
//            /\/checkout(\/.*)?/,
//            /\/account(\/.*)?/,
//            /\/admin(\/.*)?/,   
//             ]
//       const { pathname } = request.nextUrl;

//             if (protectedPaths.some((p)=> p.test(pathname))) return !!auth
//             return true
//         },
//     },
    
// } satisfies NextAuthOptions

import type { NextAuthConfig } from "next-auth";

const protectedPaths = [
  /\/checkout(\/.*)?/,
  /\/account(\/.*)?/,
  /\/admin(\/.*)?/,
];

export default {
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (protectedPaths.some((p) => p.test(pathname))) {
        return Boolean(auth);
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
