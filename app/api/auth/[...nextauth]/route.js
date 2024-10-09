import NextAuth from 'next-auth';
// import { options } from './options-rest';
import { authOptions } from './options-graphql';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };