<template>
  <table class="table-container main-page-table w-100 white news-table">
    <thead class="primary white--text">
      <td class="text-center" style="width: 50px">ID</td>
      <td class="text-center" style="min-width: 150px">Tiêu đề</td>
      <td class="text-center" style="width: 100px">Trạng thái</td>
      <td class="text-center" style="min-width: 150px">Người tạo</td>
      <td class="text-center" style="width: 138px">Ngày tạo</td>
      <td class="text-center" style="width: 132px">Lượt thích</td>
      <td class="text-center" style="width: 132px">Lượt xem</td>
      <td class="text-center" style="width: 132px">Lượt bình luận</td>
      <td class="text-center" style="width: 132px">Báo cáo</td>
      <td class="text-center" style="width: 132px"></td>
    </thead>
    <tbody class="white" :class="loadingTable ? 'body-loading' : ''">
      <div class="absolute-loading" v-if="loadingTable">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <tr v-for="(data, idx) in listData" :key="data.id">
        <td class="text-center">{{ tableStartIndex + idx + 1 }}</td>
        <td>
          <p class="mb-0 limit-line-2">
            {{ data.title }}
          </p>
        </td>
        <td
          class="text-center"
          :class="parseNewsStatusTextClass(data.status_id)"
        >
          {{ data.status_id ? parseNewsStatus(data.status_id) : "-" }}
        </td>
        <td class="text-center">
          {{ data.creator ? data.creator.name : "-" }}
        </td>
        <td class="text-center">
          {{ data.created_at ? formatDateDMY(data.created_at) : "-" }}
        </td>
        <td class="text-center">{{ data.total_like || "0" }}</td>
        <td class="text-center">{{ data.total_read || "0" }}</td>
        <td class="text-center">{{ data.total_comment || "0" }}</td>
        <td class="text-center">{{ data.total_report || "0" }}</td>
        <td class="text-center">
          <div
            class="table-actions-group d-flex"
            :class="`group-status-${data.status_id}`"
          >
            <v-tooltip v-if="data.status_id === 1" bottom>
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
              <span>{{ sysLanguage.tooltip.update }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="viewDetail(data.id)"
                >
                  <v-icon color="neutral_color_sub1">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.info }}</span>
            </v-tooltip>
            <v-tooltip v-if="data.status_id !== 3" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="revokeData(data)">
                  <v-icon color="neutral_color_sub1">
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ sysLanguage.tooltip.revoke }}</span>
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
import { formatDateDMY } from "@/helpers/dateFormater.js"
import {
  parseNewsStatus,
  parseNewsStatusTextClass,
} from "@/helpers/FormatnParse.js"
import EmptyBody from "./EmptyBody.vue"
export default {
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
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
    isSearch: {
      type: Boolean,
      default: true,
    },
    loadingTable: {
      type: Boolean,
      default: true,
    },
    tableStartIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    formatDateDMY(_d) {
      return formatDateDMY(_d)
    },
    parseNewsStatus(_d) {
      return parseNewsStatus(_d)
    },
    parseNewsStatusTextClass(_d) {
      return parseNewsStatusTextClass(_d)
    },
  },
  components: { EmptyBody },
}
</script>
<style lang="scss" scoped>
.news-table {
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
  max-width: 250px;
  display: block;

  -webkit-box-orient: vertical;
}
</style>
