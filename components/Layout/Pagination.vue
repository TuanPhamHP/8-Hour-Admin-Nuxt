<template>
  <v-layout
    row
    wrap
    style="min-width: unset"
    class="pagination-t m-0"
    :class="loading ? 'pagination-t-disabled' : ''"
  >
    <v-flex xs12 sm12 md12 class="pg-wr align-items-center">
      <v-pagination
        v-model="pagination.page"
        class="custom"
        :length="totalPage"
        total-visible="7"
        @input="pageChange"
      ></v-pagination>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'PaginationComponent',
  props: {
    paginationSync: {
      type: Object,
      default() {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagination: {
        page: 1,
        per_page: 15
      }
    };
  },
  created() {
    if (this.paginationSync) {
      this.pagination.page = this.paginationSync.page;
      this.pagination.per_page = this.paginationSync.per_page;
    }
  },
  computed: {
    totalPage() {
      return this.paginationSync ? this.paginationSync.total_pages : 1;
    },
    total() {
      return this.paginationSync ? this.paginationSync.total : 1;
    }
  },
  watch: {
    paginationSync: {
      deep: true,
      handler() {
        this.pagination = { ...this.paginationSync };
      }
    }
  },
  methods: {
    pageSizeChange() {
      this.pagination.page = 1;
      this.$emit('handlePageSizeChange', {
        page: this.pagination.page,
        per_page: this.pagination.per_page
      });
    },
    pageChange() {
      this.$emit('handlePageChange', {
        page: this.pagination.page,
        per_page: this.pagination.per_page
      });
    }
  }
};
</script>
<style lang="scss">
.pagination-t-disabled {
  opacity: 0.9;
  pointer-events: none !important;
}
.pg-wr {
  display: flex;
  justify-content: flex-end !important;
}
.dot-page {
  position: absolute;
  right: 25px;
  display: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  bottom: -6px;
}
.select-text {
  position: absolute;
  font-size: 10px;
  background-color: #fafafa;
  z-index: 7;
  right: 62px;
  top: 132px;
  width: 37px;
  padding-left: 2px;
  color: #808890;
}
.select-size .v-input__slot::before {
  display: none;
}
.v-pagination .v-pagination__navigation .v-icon {
  color: #006a9b !important;
}
.select-size {
  .v-text-field__details {
    display: none;
  }

  .v-select__slot {
    border: 1px solid #e5e7e8;
    border-radius: 4px;
    width: 68px;
    .v-select__selections {
      margin-left: 6px !important;
      width: 54px !important;
    }
  }
}
.custom .v-pagination__navigation {
  box-shadow: none !important;

  background-color: rgb(250, 250, 250) !important;
  outline: none !important;
  min-width: 36px !important;
  background-image: url('../../assets/images/chevron-left@3x.png');
  height: 36px !important;
  border: 1px solid #e6e6e6 !important;
}
.custom .v-pagination__item {
  font-size: 15px !important;
  box-shadow: none !important;
  border-radius: 8px !important;
  outline: none !important;
  min-width: 36px !important;
  height: 36px !important;
  background-color: rgb(250, 250, 250) !important;
  border: 1px solid #e6e6e6;
  margin: 0 2px !important;
  &--active {
    font-size: 15px !important;
    color: #fff !important;
  }
}
.v-list__tile {
  min-width: 50px !important;
}
.custom .v-pagination__item:focus {
  font-size: 15px !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}
</style>
