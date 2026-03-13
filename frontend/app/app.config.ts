const SANCTUM_TOKEN_KEY = 'sanctum_token';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export default defineAppConfig({
  sanctum: {
    tokenStorage: {
      get: async () => {
        const tokenCookie = useCookie(SANCTUM_TOKEN_KEY, { maxAge: TOKEN_MAX_AGE, path: '/' });
        return tokenCookie.value ?? undefined;
      },
      set: async (_app, token) => {
        const tokenCookie = useCookie(SANCTUM_TOKEN_KEY, { maxAge: TOKEN_MAX_AGE, path: '/' });
        tokenCookie.value = token ?? null;
      },
    },
  },
});
