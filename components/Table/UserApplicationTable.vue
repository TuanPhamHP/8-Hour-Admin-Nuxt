<template>
  <table class="table-container main-page-table w-100 white users-table">
    <thead class="primary white--text">
      <td class="text-center" style="width: 50px">STT</td>
      <td class="text-center">Tên hệ thống</td>
      <td class="text-center" style="width: 150px">Danh sách truy cập</td>
      <td class="text-center" style="width: 120px"></td>
    </thead>
    <tbody class="white" :class="loadingTable ? 'body-loading' : ''">
      <div class="absolute-loading" v-if="loadingTable">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <tr v-for="(data, idx) in listDataComputed" :key="data.id">
        <td class="text-center">{{ tableStartIndex + idx + 1 }}</td>

        <td class="text-center">
          {{ data.name || "-" }}
        </td>

        <td class="text-center semantic_info--text">
          {{ data.user_count || 0 }}
        </td>
        <td class="text-center">
          <div
            class="table-actions-group d-flex"
            :class="`group-status-${data.status_id}`"
          >
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="selectDataToUpdate(data)"
                >
                  <v-icon color="neutral_color_sub1">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.detail }}</span>
            </v-tooltip> -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="selectDataToUpdate(data)"
                >
                  <v-icon color="neutral_color_sub1">
                    mdi-pencil-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.updateAppUsers }}</span>
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
          <EmptyBody :isSearch="isSearch" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import EmptyBody from "./EmptyBody.vue"
import { formatDateDMY } from "@/helpers/dateFormater.js"
import objHandlerMixins from "@/mixins/objHandlerMixins.js"
import {
  parseUsersStatus,
  parseUsersStatusTextClass,
} from "@/helpers/FormatnParse.js"
import { mapState } from "vuex"
export default {
  components: { EmptyBody },
  mixins: [objHandlerMixins],
  props: {
    listData: {
      type: Array,
      default() {
        return []
      },
    },
    revokeData: {
      type: Function,
      default() {},
    },
    viewDetail: {
      type: Function,
      default() {},
    },
    selectDataToUpdate: {
      type: Function,
      default() {},
    },
    tableStartIndex: {
      type: Number,
      default: 0,
    },
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
    loadingTable: {
      type: Boolean,
      default: true,
    },
    isSearch: {
      type: Boolean,
      default: false,
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
        department_computed: o.position ? o.position.department : null,
        company_computed: o.company_id
          ? this._arrayFilter(this.companies, "id", o.company_id)
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
  justify-content: flex-end;
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
