<template functional>
  <div class="table-cell">
    <p
      :class="{'text-center': !(props.data.ubication && props.data.ubication.street.trim())}"
      v-text="props.data.ubication && props.data.ubication.street.trim()
      ? `${props.data.ubication.street} ${props.data.ubication.street2}` : '-'"
    />
  </div>
</template>
