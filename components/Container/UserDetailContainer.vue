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
      Chi tiết người dùng
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
        style="border-radius: 8px"
        :loading="loadingBtn"
        :disabled="saveBtnState < 2"
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
                  Mã nhân viên
                </p>
                <div class="info-input read-only neutral_color_sub5">
                  <input
                    v-model="detailData.code"
                    type="text"
                    :placeholder="'Mã nhân viên'"
                    class="input-no-focus w-100 font-size-16"
                    readonly
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Họ và tên
                </p>
                <div class="info-input neutral_color_sub1--text">
                  <input
                    v-model="detailData.name"
                    type="text"
                    :placeholder="'Họ và tên'"
                    class="input-no-focus w-100 font-size-16"
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Email
                </p>
                <div class="info-input neutral_color_sub1--text">
                  <input
                    v-model="detailData.email"
                    type="text"
                    :placeholder="'Email'"
                    class="input-no-focus w-100 font-size-16"
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Trạng thái
                </p>
                <div class="info-input px-0 neutral_color_sub1--text">
                  <SelectAuto
                    :key="detailData.is_active"
                    :placeholder="'Trạng thái'"
                    :onChange="onChangeStatus"
                    :default-value="+detailData.is_active"
                    :options="usersStatus"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Điện thoại
                </p>
                <div class="info-input neutral_color_sub1--text">
                  <input
                    v-model="detailData.phone"
                    type="text"
                    :placeholder="'Điện thoại'"
                    class="input-no-focus w-100 font-size-16"
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Công ty
                </p>
                <div class="info-input read-only neutral_color_sub5">
                  <input
                    :value="company_computed ? company_computed.name : ''"
                    type="text"
                    :placeholder="'Công ty'"
                    class="input-no-focus w-100 font-size-16"
                    readonly
                  />
                </div></div
            ></v-col>
            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Mật khẩu
                </p>
                <div class="info-input read-only neutral_color_sub5">
                  <input
                    value="matkhau"
                    type="password"
                    :placeholder="'Mật khẩu'"
                    class="input-no-focus w-100 font-size-16"
                    readonly
                  />
                </div>
                <v-btn
                  color="semantic_success"
                  text
                  class="mt-3 low-letter-spacing font-weight-bold py-2"
                  :loading="loadingBtnResetPassword"
                  @click="resetPassword"
                >
                  <v-icon class="mr-1">mdi-cached</v-icon> Đặt lại mật khẩu
                </v-btn>
              </div></v-col
            >

            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Bộ phận
                </p>
                <div class="info-input px-0 neutral_color_sub1--text">
                  <SelectAuto
                    :key="detailData.department_id"
                    :placeholder="'Bộ phận'"
                    :onChange="onChangeDepartment"
                    :default-value="+detailData.department_id"
                    :options="departmentsComputed"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div></div
            ></v-col>

            <v-col cols="4">
              <div class="each-top-info w-100">
                <p class="mb-1 info-label neutral--text font-weight-500">
                  Chức danh
                </p>
                <div class="info-input px-0 neutral_color_sub1--text">
                  <SelectAuto
                    :key="detailData.position_id"
                    :placeholder="'Chức danh'"
                    :onChange="onChangePosition"
                    :default-value="+detailData.position_id"
                    :options="positionsComputed"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div></div
            ></v-col>
          </v-row>

          <v-row class="mx-0 white">
            <v-col cols="12" class="px-0">
              <p
                class="detail-table-title d-flex align-center justify-between neutral--text px-4 mb-2 fw-500"
              >
                Quyền truy cập vào hệ thống
                <v-btn
                  color="primary"
                  text
                  height="48px"
                  max-width="320px"
                  class="primary_light ml-auto primary_light-opacity low-letter-spacing btn-add-group font-weight-bold w-100"
                  @click="showUpdateApplication = true"
                >
                  <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
                  Thêm quyền truy cập hệ thống
                </v-btn>
              </p>
              <div class="table-wrapper white">
                <UserDetailPermissionTable
                  :list-data="detailDataApplications"
                  :isFirstLoading="isFirstLoading"
                  :loadingTable="loadingSearch"
                  :setDataToRemove="openRemoveApps"
                />
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>
    <DialogUpdateApplications
      :isVisible="showUpdateApplication"
      :cancelAction="cancelUpdateApplication"
      :confirmAction="updatePermisson"
      :detail-data-applications="detailDataApplications"
    />

    <DialogConfirm
      :isVisible="showConfirmRemoveApps"
      :cancelAction="cancelRemoveApps"
      :confirmAction="updateApplication"
      :cancelBtnText="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancelBtnColor="'neutral_color_sub4'"
      :confirmBtnText="sysLanguage.confirmDialog.confirmBtnTextNormal"
      :title="sysLanguage.confirmDialog.removeApp"
      :message="sysLanguage.confirmDialog.removeAppPermission"
      :loadingConfirmBtn="loadingRemove"
    />
  </v-row>
</template>

<script>
import NewsLoader from "@/components/Loader/NewsLoader"
import SelectAuto from "@/components/Filter/SelectAuto.vue"
import UserDetailPositionTable from "../Table/UserDetailPositionTable.vue"
import UserDetailPermissionTable from "../Table/UserDetailPermissionTable.vue"
import DialogUpdateApplications from "../Dialog/DialogUpdateApplications.vue"
import DialogConfirm from "../Dialog/DialogConfirm.vue"

import { formatDateDMYH } from "@/helpers/dateFormater.js"
import objHandlerMixins from "@/mixins/objHandlerMixins.js"
import { mapState, mapGetters } from "vuex"
import api from "@/services"
export default {
  components: {
    NewsLoader,
    SelectAuto,
    DialogConfirm,
    // eslint-disable-next-line vue/no-unused-components
    UserDetailPositionTable,
    UserDetailPermissionTable,
    DialogUpdateApplications,
  },
  mixins: [objHandlerMixins],
  data() {
    return {
      tab: null,
      loadingRemove: false,
      showConfirmRemoveApps: false,
      showUpdateApplication: false,
      listData: [],
      listReportsData: [],
      loadingSearch: false,
      loadingBtnResetPassword: false,
      isFirstLoading: true,
      detailData: {},
      selectedAppToRemove: {},
      detailDataPosition: [],
      detailDataApplications: [],
      refComment: 1,
      forcedLoading: false,
      loadingTablePosition: false,
      loadingBtn: false,
      saveBtnState: 0,
      //
      is_active: null,
      company_computed: null,
      department_computed: null,
    }
  },
  computed: {
    ...mapState({
      detailUser: (state) => state.users.detailUser,
      companies: (state) => state.users.companies,
      departments: (state) => state.users.departments,
      positions: (state) => state.users.positions,
      applications: (state) => state.users.applications,
      usersStatus: (state) => state.users.usersStatus,
    }),
    ...mapGetters({
      userFromAuth: "userFromAuth",
    }),
    detailDataPositionComputed() {
      return this.detailDataPosition.map((o) => ({
        ...o,
        is_main: o.id === this.detailData.position_id,
      }))
    },
    departmentsComputed() {
      return this.departments.filter(
        (o) => o.company_id === this.detailData.company_id,
      )
    },
    positionsComputed() {
      const arr = this.positions.map((o) => ({
        ...o,
        company_id:
          o.department && o.department.company_id
            ? o.department.company_id
            : -1,
      }))
      return arr.filter(
        (o) =>
          o.company_id === this.detailData.company_id &&
          (this.detailData.department_id
            ? o.department_id === this.detailData.department_id
            : true),
      )
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
      return this.detailUser
    },
  },

  watch: {
    detailData: {
      deep: true,
      handler() {
        if (this.saveBtnState === 0) {
          this.saveBtnState = 1
        } else {
          this.saveBtnState = 2
        }
      },
    },
  },
  mounted() {
    this.getDetailData()
    this.getDetailPositionData()
    this.getDetailApplicationsData()
  },
  methods: {
    updatePermisson() {
      this.getDetailApplicationsData()
    },
    cancelUpdateApplication() {
      this.showUpdateApplication = false
    },
    onChangeStatus(_val) {
      this.detailData.is_active = _val
    },
    onChangeDepartment(_val) {
      this.detailData = {
        ...this.detailData,
        department_id: _val,
        position_id: null,
      }
    },
    onChangePosition(_val) {
      this.detailData.position_id = _val
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
      this.$router.push(prvRoute || "/users")
      // this.$router.go(-1)
    },

    async getDetailData(isSearch = false) {
      const payload = {}
      const id = this.$route.params.id
      if (isSearch) {
        this.loadingSearch = true
      }
      const res = await api.users.getDetailUser(id, payload)
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
        this.detailData = {
          ...dataObj.user,
          is_active: dataObj.user.is_active ? 1 : 2,
          department_id: dataObj.user.position
            ? dataObj.user.position.department_id
            : null,
        }
        this.company_computed = this._arrayFilter(
          this.companies,
          "id",
          dataObj.user.company_id,
        )
        this.department_computed = dataObj.user.position
          ? dataObj.user.position.department
          : null
        this.$nextTick(() => {
          this.saveBtnState = 1
        })
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getDetailPositionData(isSearch = false) {
      const payload = { user_id: this.$route.params.id, pagination: false }
      if (isSearch) {
        this.loadingTablePosition = true
      }
      const res = await api.positions.getListData(payload)
      this.isFirstLoading = false

      this.loadingTablePosition = false
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
        this.detailDataPosition = dataObj.positions
        // this.company_computed = this._arrayFilter(
        //   this.companies,
        //   "id",
        //   dataObj.user.company_id,
        // )
        // this.department_computed = dataObj.user.position
        //   ? dataObj.user.position.department
        //   : null
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getDetailApplicationsData(isSearch = false) {
      const payload = { user_id: this.$route.params.id, pagination: false }
      if (isSearch) {
        this.loadingTablePosition = true
      }
      const res = await api.applications.getListData(payload)
      this.isFirstLoading = false

      this.loadingTablePosition = false
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
        this.detailDataApplications = dataObj.applications
        // this.company_computed = this._arrayFilter(
        //   this.companies,
        //   "id",
        //   dataObj.user.company_id,
        // )
        // this.department_computed = dataObj.user.position
        //   ? dataObj.user.position.department
        //   : null
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async onSubmit() {
      // this.submitClicked = true
      // if (Object.keys(this.errorObjUnder).length) {
      //   return
      // }
      const body = {
        name: this.detailData.name,
        email: this.detailData.email,
        phone: this.detailData.phone,
        position_id: this.detailData.position_id,
        is_active: this.detailData.is_active === 1 ? 1 : 0,
      }
      this.loadingBtn = true
      const res = await api.users.update(this.$route.params.id, body)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.updateUserFail,
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
          this.sysLanguage.snackbar.updateUserSuccess,
        )
        if (+this.$route.params.id === this.userFromAuth.id) {
          this.$store.commit("HOTSET_USER", res.data.data.user)
        }
        this.getDetailData()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async resetPassword() {
      this.loadingBtnResetPassword = true
      const res = await api.users.resetPassword(this.$route.params.id, {})
      this.loadingBtnResetPassword = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.resetPasswordFail,
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
          this.sysLanguage.snackbar.resetPasswordSuccess,
        )
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    cancelRemoveApps() {
      this.showConfirmRemoveApps = false
    },
    openRemoveApps(_data) {
      this.showConfirmRemoveApps = true
      this.selectedAppToRemove = { ..._data }
    },
    async updateApplication() {
      const body = {
        application_ids: this.detailDataApplications
          .filter((o) => o.id !== this.selectedAppToRemove.id)
          .map((o) => o.id),
      }
      this.loadingRemove = true
      const res = await api.applications.syncApplications(
        this.$route.params.id,
        body,
      )
      this.loadingRemove = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.updateApplicationsFail,
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
          this.sysLanguage.snackbar.updateApplicationsSuccess,
        )
        this.getDetailApplicationsData()
        this.cancelRemoveApps()
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
</style>
