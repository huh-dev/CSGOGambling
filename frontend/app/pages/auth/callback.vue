<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const { setTokenFromCallback } = useAuth();

onMounted(async () => {
  const token = route.query.token as string | undefined;
  const error = route.query.error as string | undefined;

  if (error) {
    await navigateTo('/?error=' + error, { replace: true });
    return;
  }

  if (!token) {
    await navigateTo('/?error=missing_token', { replace: true });
    return;
  }

  const success = await setTokenFromCallback(token);
  if (success) {
    await navigateTo('/', { replace: true });
  } else {
    await navigateTo('/?error=login_failed', { replace: true });
  }
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <p class="text-muted-foreground">Completing login...</p>
  </div>
</template>
