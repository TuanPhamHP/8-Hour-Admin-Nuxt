<template>
  <tbody :class="isShow ? '' : 'on-hiding-body'">
    <tr>
      <td colspan="100" class="text-center py-5">Đang tải dữ liệu...</td>
    </tr>
    <tr>
      <td colspan="100" class="text-center">
        <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss">
tbody {
  transition: 0.3s ease;
  td {
    font-size: 14px !important;
  }
  &.on-hiding-body {
    transform: translateX(-20px);
    transform-origin: top;
    opacity: 0;
    visibility: hidden;
  }
}
</style>
