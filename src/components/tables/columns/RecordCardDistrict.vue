<template functional>
  <div
    class="text-center"
    v-text="props.data.ubication && props.data.ubication.district !== null ? props.data.ubication.district : '-'"
  />
</template>
