<script setup lang="ts">
interface SanctumUser {
  name?: string;
}

const { steamLogin, isAuthenticated, user, logout } = useAuth<SanctumUser>();
const route = useRoute();
const error = computed(() => route.query.error as string | undefined);
</script>

<template>
  <div class="p-2">
    <div v-if="error" class="mb-2 rounded border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      Login failed. Please try again.
    </div>
    <div v-if="isAuthenticated && user" class="flex flex-col gap-2">
      Logged in as {{ user?.name ?? 'User' }}

      <Button class="w-fit" variant="outline" @click="() => logout()">
        Logout
      </Button>

      <InventoryGrid />

    </div>
    <Button
      v-if="!isAuthenticated"
      variant="outline"
      @click="steamLogin"
    >
      Login with Steam
    </Button>
  </div>
</template>