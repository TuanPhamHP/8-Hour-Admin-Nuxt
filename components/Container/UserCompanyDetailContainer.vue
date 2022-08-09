<template>
  <v-row class="m-0 p-0 pt-1 user-feed-rowflex-column align-start">
    <div class="content-slot-header py-2 px-3 w-100">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            class="mb-0 mr-1"
            color="neutral"
            @click="fallBack"
          >
            <v-icon> mdi-arrow-left </v-icon>
          </v-btn>
        </template>
        <span>Quay lại</span>
      </v-tooltip>
      Chi tiết Công ty
      <v-btn
        color="neutral_color_sub4"
        depressed
        style="border-radius: 8px"
        :disabled="loadingBtn"
        @click="fallBack"
        class="ml-auto px-5 neutral_color_sub2--text low-letter-spacing"
      >
        Hủy
      </v-btn>
      <v-btn
        color="primary"
        depressed
        :loading="loadingBtn"
        style="border-radius: 8px"
        class="ml-2 low-letter-spacing"
        @click="onSubmit"
      >
        Lưu
      </v-btn>
    </div>
    <v-col cols="12" class="py-0">
      <div class="mx-auto w-100 content-wrap-relative">
        <v-btn
          class="mx-auto my-5 d-block box-shadow--mod white btn-load-absolute"
          fab
          light
          small
          loading
          v-if="isFirstLoading || forcedLoading"
        >
          <v-icon dark> mdi-minus </v-icon>
        </v-btn>
        <NewsLoader v-if="showSkeletonPost" />
        <div v-if="!showSkeletonPost" class="detail-content">
          <v-row class="white mx-0 my-0 px-8 pt-2 pb-4">
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Công ty
                </p>
                <div class="info-input">
                  <input
                    v-if="detailData && detailData.name"
                    :value="detailData.name"
                    type="text"
                    :placeholder="'Công ty'"
                    class="input-no-focus w-100 font-size-16"
                  />
                </div></div
            ></v-col>

            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Tên viết tắt
                </p>
                <div class="info-input">
                  <input
                    v-if="detailData && detailData.code"
                    :value="detailData.code"
                    type="text"
                    :placeholder="'Công ty'"
                    class="input-no-focus w-100 font-size-16"
                  />
                </div></div
            ></v-col>
          </v-row>
          <div class="white py-2 mt-4">
            <v-tabs
              v-model="tab"
              background-color="transparent"
              class="mb-4 tab-control neutral_color_sub5--text"
            >
              <v-tab class="v-tab-normalize px-5"> Danh sách bộ phận </v-tab>
              <v-tab class="v-tab-normalize px-5"> Danh sách chức danh </v-tab>
              <v-tab class="v-tab-normalize px-5"> Danh sách nhân viên </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-btn
                  color="primary"
                  text
                  height="48px"
                  max-width="320px"
                  class="primary_light d-block mr-2 ml-auto mb-3 primary_light-opacity low-letter-spacing btn-add-group font-weight-bold w-100"
                  @click="showCreateDepartment = true"
                >
                  <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
                  Thêm bộ phận
                </v-btn>
                <div class="table-wrapper">
                  <CompanyDepartmentDetailTable
                    :list-data="listDepartment"
                    :isFirstLoading="isFirstLoading"
                    :loadingTable="loadingUsers"
                    :removeData="removeDepartment"
                  />
                </div>
              </v-tab-item>

              <v-tab-item>
                <v-btn
                  color="primary"
                  text
                  height="48px"
                  max-width="320px"
                  class="primary_light d-block mr-2 ml-auto mb-3 primary_light-opacity low-letter-spacing btn-add-group font-weight-bold w-100"
                  @click="showCreatePosition = true"
                >
                  <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
                  Thêm chức danh
                </v-btn>
                <div class="table-wrapper">
                  <PositionDepartmentDetailTable
                    :list-data="listPosition"
                    :isFirstLoading="isFirstLoading"
                    :loadingTable="loadingUsers"
                    :removeData="removePosition"
                  />
                </div>
              </v-tab-item>

              <v-tab-item>
                <div class="panigate-block px-2">
                  <Pagination
                    :loading="loadingSearch"
                    class="mt-0"
                    :pagination-sync="pagination"
                    @handlePageSizeChange="pagePaginationChange"
                    @handlePageChange="pagePaginationChange"
                  />
                </div>
                <div class="table-wrapper">
                  <UserDepartmentDetailTable
                    :list-data="listUserDepartment"
                    :isFirstLoading="isFirstLoading"
                    :loadingTable="loadingUsers"
                  />
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </div>
    </v-col>
    <DialogAddUserTable
      :isVisible="showAddUserDialog"
      :confirmAction="addUser"
      :cancelAction="closeAddUserDialog"
      :usersDefaultIds="listUserIds"
    />

    <DialogCreatePositionFromCompany
      :isVisible="showCreatePosition"
      :cancelAction="cancelCreatePosition"
      :confirmAction="syncPosition"
      :detailData="detailData"
    />
    <DialogCreateDepartmentFromCompany
      :isVisible="showCreateDepartment"
      :cancelAction="cancelCreateDepartment"
      :confirmAction="syncDepartment"
      :detailData="detailData"
    />
  </v-row>
</template>

<script>
import NewsLoader from "@/components/Loader/NewsLoader"
import PositionDepartmentDetailTable from "../Table/PositionDepartmentDetailTable.vue"
import UserDepartmentDetailTable from "../Table/UserDepartmentDetailTable.vue"
import CompanyDepartmentDetailTable from "../Table/CompanyDepartmentDetailTable.vue"
import DialogAddUserTable from "@/components/Dialog/DialogAddUserTable.vue"
import Pagination from "@/components/Layout/Pagination.vue"
import DialogCreatePositionFromCompany from "../Dialog/DialogCreatePositionFromCompany.vue"
import DialogCreateDepartmentFromCompany from "../Dialog/DialogCreateDepartmentFromCompany.vue"

import { formatDateDMYH } from "@/helpers/dateFormater.js"
import objHandlerMixins from "@/mixins/objHandlerMixins.js"
import { mapState } from "vuex"
import api from "@/services"
export default {
  components: {
    NewsLoader,
    PositionDepartmentDetailTable,
    UserDepartmentDetailTable,
    DialogAddUserTable,
    CompanyDepartmentDetailTable,
    Pagination,
    DialogCreatePositionFromCompany,
    DialogCreateDepartmentFromCompany,
  },
  mixins: [objHandlerMixins],
  data() {
    return {
      showCreateDepartment: false,
      showCreatePosition: false,
      tab: null,
      showAddUserDialog: false,
      submitClicked: false,
      listData: [],
      listReportsData: [],
      loadingSearch: false,
      loadingBtn: false,
      loadingUsers: false,
      isFirstLoading: true,
      detailData: {},
      refComment: 1,
      forcedLoading: false,
      loadingDisapprove: false,
      loadingApprove: false,
      department_id: 0,
      parent_id: 0,
      limitSizeName: 50,
      //
      is_active: null,
      company_computed: { name: "" },
      department_computed: null,
      listUserDepartment: [],
      listUserIds: [],
      listPosition: [],
      listChildDep: [],
      listDepartment: [],
      pagination: {
        total: 1,
        total_pages: 1,
        per_page: 15,
        page: 1,
      },
    }
  },
  computed: {
    ...mapState({
      departments: (state) => state.users.departments,
      companies: (state) => state.users.companies,
      usersStatus: (state) => state.users.usersStatus,
      listUsers: (state) => state.users.listUsers,
    }),
    errorObjUnder() {
      const obj = {}
      if (!this.detailData.name || !String(this.detailData.name).trim()) {
        obj.name = "Không được để trống tên phòng ban"
      }
      // if (!this.detailData.department_id) {
      //   obj.department = "Không được để trống bộ phận"
      // }

      return obj
    },
    errorObj() {
      return this.submitClicked ? this.errorObjUnder : {}
    },
    showSkeletonPost() {
      return (
        this.isFirstLoading && (!this.detailComputed || !this.detailComputed.id)
      )
    },
    detailComputed() {
      if (this.detailData && this.detailData.id) {
        return this.detailData
      }
      return {}
    },
    departmentsComputed() {
      return this.departments.filter(
        (o) => o.company_id === this.detailData.company_id,
      )
    },
    companyComputed() {
      return this.detailData && this.detailData.id
        ? this._arrayFilter(this.companies, "id", this.detailData.company_id)
        : { name: "" }
    },
  },
  watch: {
    $route() {
      this.getDetailData()
      this.getListPositions()
      this.getListUsers()
    },
    listUserIds: {
      deep: true,
      handler() {
        this.listUserDepartment = this.listUsers.filter((o) =>
          this.listUserIds.includes(o.id),
        )
      },
    },
    listUsers: {
      deep: true,
      handler() {
        this.listUserDepartment = this.listUsers.filter((o) =>
          this.listUserIds.includes(o.id),
        )
      },
    },
    "detailData.name"() {
      if (this.detailData.name.length > this.limitSizeName) {
        this.detailData.name = this.detailData.name.slice(0, this.limitSizeName)
      }
    },
  },
  mounted() {
    this.getDetailData()
    this.getListPositions()
    this.getListUsers()
    this.getListDepartments()
  },
  methods: {
    syncUrl() {
      const query = {
        size: this.pagination.per_page,
        page: this.pagination.page,
      }
      this.getListUsers(query)
    },
    cancelCreatePosition() {
      this.showCreatePosition = false
    },
    cancelCreateDepartment() {
      this.showCreateDepartment = false
    },
    syncPosition() {
      this.getDetailData()
      this.getListPositions()
    },
    syncDepartment() {
      this.getListDepartments()
    },

    onAddUser() {
      this.showAddUserDialog = true
    },
    closeAddUserDialog() {
      this.showAddUserDialog = false
    },
    addUser(_users) {
      this.listUserIds = [..._users]

      this.closeAddUserDialog()
    },
    pagePaginationChange(_val) {
      this.pagination = {
        ...this.pagination,
        per_page: _val.per_page,
        page: _val.page,
      }
      this.syncUrl()
    },
    onChangeDepartment(_val) {
      this.parent_id = _val
    },
    resolveReportLocal(report) {
      const index = this.listReportsData.findIndex((o) => o.id === report.id)
      if (index !== -1) {
        this.listReportsData.splice(index, 1, report)
      }
    },
    formatDateDMYH(_d) {
      return formatDateDMYH(_d)
    },

    fallBack() {
      const prvRoute = ""
      this.$router.push(prvRoute || "/user-company")
      // this.$router.go(-1)
    },

    async getListUsers(_query = {}) {
      this.loadingUsers = true
      const payload = { ..._query, company_id: this.$route.params.id }
      const res = await api.users.getListUsers(payload)
      this.isFirstLoading = false
      this.loadingUsers = false
      this.firstSync = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getUsersFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          console.log(res)
          return
        }
        const dataObj = res.data.data
        // this.listUserDepartment = [...dataObj.users]
        this.listUserIds = dataObj.users.map((o) => o.id)
        this.pagination = {
          total: dataObj.meta.pagination.total,
          total_pages: dataObj.meta.pagination.total_pages,
          per_page: dataObj.meta.pagination.per_page,
          page: dataObj.meta.pagination.current_page,
        }
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getListPositions(_query = {}) {
      this.loadingPosition = true
      const payload = { ..._query, company_id: this.$route.params.id }
      const res = await api.positions.getListData(payload)
      this.loadingPosition = false
      this.firstSync = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getPositionsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          console.log(res)
          return
        }
        const dataObj = res.data.data
        this.listPosition = dataObj.positions
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getListDepartments(_query = {}) {
      this.loadingPosition = true
      const payload = { ..._query, company_id: this.$route.params.id }
      const res = await api.departments.getListData(payload)
      this.loadingPosition = false
      this.firstSync = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getDepartmentsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          console.log(res)
          return
        }
        const dataObj = res.data.data
        this.listDepartment = dataObj.departments
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getDetailData(isSearch = false) {
      const payload = {}
      const id = this.$route.params.id
      if (isSearch) {
        this.loadingSearch = true
      }
      const res = await api.companies.getDetailData(id, payload)
      this.isFirstLoading = false

      this.loadingSearch = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getNewsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          console.log(res)
          return
        }
        const dataObj = res.data.data
        this.detailData = dataObj.company
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async onSubmit() {
      this.submitClicked = true
      if (Object.keys(this.errorObjUnder).length) {
        return
      }
      const body = {
        name: this.detailData.name,
        user_ids: [...this.listUserIds],
        department_id: this.department_id,
        parent_id: this.parent_id,
      }
      this.loadingBtn = true
      const res = await api.departments.update(this.$route.params.id, body)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.updatePositionFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.$store.commit(
          "toast/getSuccess",
          this.sysLanguage.snackbar.updatePositionSuccess,
        )
        this.getDetailData()
        this.getListUsers()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async removeDepartment(data) {
      this.loadingRevoke = true
      const res = await api.departments.delete(data.id)
      this.loadingRevoke = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.removeDepartmentFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.$store.commit(
          "toast/getSuccess",
          this.sysLanguage.snackbar.removeDepartmentSuccess,
        )

        this.getListDepartments()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async removePosition(data) {
      this.loadingRevoke = true
      const res = await api.positions.delete(data.id)
      this.loadingRevoke = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.removePositionFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.$store.commit(
          "toast/getSuccess",
          this.sysLanguage.snackbar.removePositionSuccess,
        )

        this.getListPositions()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
  },
}
</script>

<style>
.container-empty-background {
  display: block;
  /* margin: auto; */
  max-width: 95%;
}
</style>
<style lang="scss" scoped>
.user-feed-row {
  align-items: flex-start;
  min-height: 80vh;
}
.detail-content {
  border-radius: 8px;
  .table-wrapper {
    position: relative;
    /* height: calc(100% - 100px); */
    max-height: calc(100vh - 400px);
    padding-bottom: 70px;
    overflow-x: scroll;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #e6e6e600;
      border-radius: 0px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 0px;
      background: rgba(176, 176, 176, 0.526);
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        border-radius: 0px;
        background: rgb(96, 96, 96);
      }
    }
  }
}
.fallback-header {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.0125em;
  text-transform: uppercase;
}
.each-top-info {
  padding: 0 20px;
  .info-label {
    font-size: 16px;
    line-height: 28px;
  }
  .info-input {
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: 8px;
    height: 48px;
    padding: 10px 12px;
  }
}
.detail-table-title {
  border-bottom: 1px solid #f2f2f2;
}
.tab-control {
  border-bottom: 1px solid;
}
</style>
