export const useAuth = <T = Record<string, unknown>>() => {
  const sanctumAuth = useSanctumAuth<T>();
  const config = useRuntimeConfig();

  const steamLogin = () => {
    const baseUrl = config.public.sanctum?.baseUrl ?? '';
    window.location.href = `${baseUrl}/auth/steam`;
  };

  const setTokenFromCallback = async (token: string): Promise<boolean> => {
    const nuxtApp = useNuxtApp();
    const tokenStorage = useSanctumAppConfig().tokenStorage;
    if (tokenStorage) {
      await tokenStorage.set(nuxtApp, token);
    }
    try {
      await sanctumAuth.refreshIdentity();
      return true;
    } catch {
      if (tokenStorage) {
        await tokenStorage.set(nuxtApp, undefined);
      }
      return false;
    }
  };

  return {
    ...sanctumAuth,
    steamLogin,
    setTokenFromCallback,
  };
};