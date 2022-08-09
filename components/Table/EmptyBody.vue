<template>
  <div>
    <img
      src="@/assets/images/no-user-filter.svg"
      width="300px"
      alt=""
      class="mt-5"
    />
    <p class="neutral_color_sub3--text my-4" style="font-size: 20px">
      {{
        isSearch
          ? sysLanguage.table.mtySearchData
          : sysLanguage.table.mtyPlainData
      }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style></style>
