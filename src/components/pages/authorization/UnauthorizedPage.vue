<template>
  <div class="unauthorized irisbox bg-danger text-white">
    <h1>{{ $t('unauthorized_title') }}</h1>
    <p>{{ $t('unauthorized_description') }}</p>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedPage',
}
</script>
