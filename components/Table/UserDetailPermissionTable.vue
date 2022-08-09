<template>
  <table class="table-container main-page-table w-100 white users-table">
    <thead class="primary white--text">
      <td class="text-center" style="width: 50px">STT</td>
      <td class="text-center">Tên Module/ Hệ thống</td>

      <td class="text-center" style="width: 132px"></td>
    </thead>
    <tbody class="white" :class="loadingTable ? 'body-loading' : ''">
      <div class="absolute-loading" v-if="loadingTable">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <tr v-for="(data, idx) in listDataComputed" :key="data.id">
        <td class="text-center">{{ idx + 1 }}</td>
        <td class="text-center">
          {{ data.name || "-" }}
        </td>
        <td>
          <div class="table-actions-group d-flex" :class="`group-status-4`">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="setDataToRemove(data)"
                >
                  <v-icon color="neutral_color_sub1">
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.remove }}</span>
            </v-tooltip>
          </div>
        </td>
      </tr>
      <tr v-if="isFirstLoading">
        <td colspan="100" class="text-center py-5">Đang tải dữ liệu...</td>
      </tr>
      <tr v-if="isFirstLoading">
        <td colspan="100" class="text-center py-5">
          <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
        </td>
      </tr>
      <tr
        v-if="!isFirstLoading && (!listData || !listData.length)"
        class="no-data"
      >
        <td colspan="100" class="text-center py-5">
          <img
            src="@/assets/images/no-user-filter.svg"
            width="300px"
            alt=""
            class="mt-5"
          />
          <p class="neutral_color_sub3--text my-4" style="font-size: 20px">
            Hiện chưa có dữ liệu
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { formatDateDMY } from "@/helpers/dateFormater.js"
import objHandlerMixins from "@/mixins/objHandlerMixins.js"
import {
  parseUsersStatus,
  parseUsersStatusTextClass,
} from "@/helpers/FormatnParse.js"
import { mapState } from "vuex"
export default {
  mixins: [objHandlerMixins],
  props: {
    listData: {
      type: Array,
      default() {
        return []
      },
    },
    setDataToRemove: {
      type: Function,
      default() {},
    },
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
    loadingTable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      companies: (state) => state.users.companies,
      listUsers: (state) => state.users.listUsers,
    }),
    listDataComputed() {
      return this.listData.map((o) => ({
        ...o,
        department_computed: o.department ? o.department : null,
        company_computed:
          o.department && o.department.company_id
            ? this._arrayFilter(this.companies, "id", o.department.company_id)
            : null,
        creator_computed: o.creator_id
          ? this._arrayFilter(this.listUsers, "id", o.creator_id)
          : null,
      }))
    },
  },
  methods: {
    formatDateDMY(_d) {
      return formatDateDMY(_d)
    },
    parseUsersStatus(_d) {
      return parseUsersStatus(_d)
    },
    parseUsersStatusTextClass(_d) {
      return parseUsersStatusTextClass(_d)
    },
  },
}
</script>
<style lang="scss" scoped>
.users-table {
  tbody {
    td {
      font-size: 14px !important;
    }
  }
  thead {
    position: sticky;
    top: 0;
    z-index: 3;
  }
}

.group-status-2 {
}
.group-status-3 {
  padding-right: 36px;
}
.table-actions-group {
  justify-content: flex-start;
}
.v-application {
  .body-loading {
    opacity: 0.8;
    background-color: rgba(239, 240, 240, 0.563) !important;
    pointer-events: none;
    position: relative;
  }
  .absolute-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    min-height: 200px;
    background-color: rgba(239, 240, 240, 0.563) !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<style>
.limit-line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 450px;
  display: block;

  -webkit-box-orient: vertical;
}
</style>
