<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- 
      Le composant <Toast /> est rendu ici, au niveau racine.
      Il est enregistré globalement par le plugin vue-toastification et persistera lors des changements de page.
    -->
    <Toast />
  </div>
</template>