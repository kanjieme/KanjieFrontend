<template>
  <div class="min-h-screen flex">
    <DashboardSidebar />
    <div class="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
      <DashboardTopbar />
      <main class="flex-1 p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
