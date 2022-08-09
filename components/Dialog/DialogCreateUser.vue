<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="960"
    style="border-radius: 8px"
  >
    <v-card class="create-user-dialog">
      <v-card-title class="primary px-4">
        <div class="d-flex align-center">
          <v-btn color="white" icon @click="cancelAction"
            ><v-icon size="20px">mdi-close</v-icon></v-btn
          >
          <span
            class="white--text dialog-title"
            style="font-size: 16px !important; font-weight: 400"
            >Thêm người dùng mới</span
          >
        </div>
      </v-card-title>
      <div class="dialog-body-content">
        <div class="left-side scroll-y-mod_big">
          <v-row>
            <v-col cols="6" class="py-0">
              <div class="input-block read-only py-2">
                <label class="input-form-label black--text pb-2">
                  Công ty
                </label>
                <div
                  class="info-input px-0 neutral_color_sub3--text"
                  :class="errorObj.company ? 'error-border' : ''"
                >
                  <SelectAuto
                    v-if="isVisible"
                    :key="company_id"
                    :placeholder="'Công ty'"
                    :onChange="onChangeCompany"
                    :default-value="+company_id"
                    :options="companies"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div>
                <p
                  v-if="errorObj.company"
                  class="semantic_error--text error-msg-small mb-0"
                >
                  {{ errorObj.company }}
                </p>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block read-only py-2">
                <label class="input-form-label black--text pb-2">
                  Bộ phận
                </label>
                <div class="info-input px-0 neutral_color_sub3--text">
                  <SelectAuto
                    v-if="isVisible"
                    :key="department_id"
                    :placeholder="'Bộ phận'"
                    :onChange="onChangeDepartment"
                    :default-value="+department_id"
                    :options="departmentsComputed"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block read-only py-2">
                <label class="input-form-label black--text pb-2">
                  Chức danh
                </label>
                <div class="info-input px-0 neutral_color_sub3--text">
                  <SelectAuto
                    :key="company_id"
                    :placeholder="'Chức danh'"
                    :onChange="onChangePosition"
                    :default-value="+position_id"
                    :options="positionsComputed"
                    :clearAble="false"
                    :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <div class="divider neutral_color_sub4 my-3"></div>
            <v-col cols="6" class="py-0">
              <div class="input-block py-1">
                <label class="input-form-label black--text pb-2">
                  Mã nhân viên
                </label>
                <input
                  type="text"
                  class="input input-form-border neutral_color_sub4 mb-2"
                  disabled
                />
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block read-only py-2">
                <label class="input-form-label black--text pb-2"> Email </label>
                <input
                  v-model="email"
                  type="text"
                  class="input input-form-border neutral_color_sub3 bg-white mb-2"
                  :class="errorObj.email ? 'error-border' : ''"
                  placeholder="Email"
                />
                <p
                  v-if="errorObj.email"
                  class="semantic_error--text error-msg-small mb-0"
                >
                  {{ errorObj.email }}
                </p>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block py-1">
                <label class="input-form-label black--text pb-2">
                  Họ và tên
                </label>
                <input
                  v-model="name"
                  type="text"
                  class="input input-form-border neutral_color_sub3 bg-white mb-2"
                  :class="errorObj.name ? 'error-border' : ''"
                  placeholder="Họ và tên"
                />
                <p
                  v-if="errorObj.name"
                  class="semantic_error--text error-msg-small mb-0"
                >
                  {{ errorObj.name }}
                </p>
                <span
                  class="small-charactor-count neutral_color_sub3--text"
                  :class="
                    name.length === limitSizeName
                      ? 'reach-max semantic_error--text'
                      : ''
                  "
                >
                  {{ name.length }}/{{ limitSizeName }}
                </span>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block py-1">
                <label class="input-form-label black--text pb-2">
                  Điện thoại
                </label>
                <input
                  v-model="phone"
                  type="text"
                  class="input input-form-border neutral_color_sub3 bg-white mb-2"
                  :class="errorObj.phone ? 'error-border' : ''"
                  placeholder="Điện thoại"
                />
                <p
                  v-if="errorObj.phone"
                  class="semantic_error--text error-msg-small mb-0"
                >
                  {{ errorObj.phone }}
                </p>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block py-1">
                <label class="input-form-label black--text pb-2">
                  Mật khẩu mặc định
                </label>
                <input
                  v-model="password"
                  type="password"
                  class="input input-form-border neutral_color_sub4 mb-2"
                  :class="errorObj.password ? 'error-border' : ''"
                  placeholder="Mật khẩu"
                  readonly
                />
                <p
                  v-if="errorObj.password"
                  class="semantic_error--text error-msg-small mb-0"
                >
                  {{ errorObj.password }}
                </p>
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div class="input-block py-1">
                <label class="input-form-label black--text pb-2">
                  Trạng thái
                </label>
                <input
                  value="Đang hoạt động"
                  type="text"
                  class="input input-form-border neutral_color_sub4 mb-2"
                  disabled
                />
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <!-- ACTIONS -->
      <div class="news_block_bg py-2 px-3 group-btn-add-user mt-1 d-flex">
        <v-btn
          :disabled="loadingBtn"
          :color="'neutral_color_sub4 neutral_color_sub2--text'"
          class="rounded-lg v-btn-confirm ml-auto mr-2"
          @click="cancelAction"
          depressed
        >
          {{ sysLanguage.button.cancel }}
        </v-btn>
        <v-btn
          :color="'primary'"
          :loading="loadingBtn"
          class="rounded-lg v-btn-confirm"
          :disabled="!ableToCreate"
          @click="onSubmit"
          depressed
        >
          {{ sysLanguage.button.save }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import handleFiles from "@/mixins/handleFiles.js"
import SelectAuto from "@/components/Filter/SelectAuto.vue"
import api from "@/services"
import { mapState } from "vuex"
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    cancelAction: {
      type: Function,
      default() {},
    },
    confirmAction: {
      type: Function,
      default() {},
    },
  },
  components: { SelectAuto },
  mixins: [handleFiles],
  data() {
    return {
      dialog: false,
      loadingBtn: false,
      submitClicked: false,
      name: "",
      email: "",
      phone: "",
      password: "1234567890",
      position: {},
      position_id: null,
      department_id: null,
      company_id: null,

      limitSizeName: 60,
      limitSizeEmail: 8,
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
      companies: (state) => state.users.companies,
      departments: (state) => state.users.departments,
      positions: (state) => state.users.positions,
    }),
    ableToCreate() {
      return true
    },
    departmentsComputed() {
      return this.departments.filter((o) => o.company_id === this.company_id)
    },
    positionsComputed() {
      if (!this.department_id) {
        return []
      }
      const arr = this.positions.map((o) => ({
        ...o,
        company_id:
          o.department && o.department.company_id
            ? o.department.company_id
            : -1,
      }))
      return arr.filter(
        (o) =>
          o.company_id === this.company_id &&
          (this.department_id ? o.department_id === this.department_id : true),
      )
    },
    listUserSelectedComputed() {
      return this.listUsers.filter((o) => this.listUserIds.includes(o.id))
    },
    errorObjUnder() {
      const obj = {}
      if (!this.name || !String(this.name).trim()) {
        obj.name = "Không được để trống tên người dùng"
      }
      if (!this.email || !String(this.email).trim()) {
        obj.email = "Không được để trống email"
      }
      if (!this.phone || !String(this.phone).trim()) {
        obj.phone = "Không được để trống số điện thoại"
      }
      if (String(this.password).trim().length < 8) {
        obj.password = "Độ dài tối thiểu 8 ký tự"
      }
      if (!this.password || !String(this.password).trim()) {
        obj.password = "Không được để trống mật khẩu"
      }
      if (!this.company_id) {
        obj.company = "Không được để trống công ty"
      }

      return obj
    },
    errorObj() {
      return this.submitClicked ? this.errorObjUnder : {}
    },
  },
  watch: {
    isVisible() {
      this.resetData()
      this.dialog = this.isVisible
    },
    name() {
      if (this.name.length > this.limitSizeName) {
        this.name = this.name.slice(0, this.limitSizeName)
      }
    },
    department_id: {
      deep: true,
      handler() {
        this.position_id = null
      },
    },
    company_id: {
      deep: true,
      handler(newData, oldData) {
        if (oldData) {
          this.position_id = null
          this.department_id = null
        }
      },
    },
  },
  mounted() {},
  methods: {
    resetData() {
      this.submitClicked = false
      this.name = ""
      this.email = ""
      this.phone = ""
      this.password = "1234567890"
      this.position = {}
      this.position_id = null
      this.department_id = null
      this.company_id = null
    },
    onChangeCompany(_val) {
      this.company_id = _val
    },
    onChangeDepartment(_val) {
      this.department_id = _val
    },
    onChangePosition(_val) {
      this.position_id = _val
    },
    // USER HANDLER
    async onSubmit() {
      this.submitClicked = true
      if (Object.keys(this.errorObjUnder).length) {
        return
      }
      const body = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        position_id: this.position_id,
        company_id: this.company_id,
      }

      this.loadingBtn = true
      const res = await api.users.create(body)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.createUserFail,
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
          this.sysLanguage.snackbar.createUserSuccess,
        )
        this.confirmAction()
        this.cancelAction()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.create-user-dialog {
  .dialog-title {
    font-weight: 400;
    font-size: 16px !important;
    line-height: 28px;
  }
  .dialog-body-content {
    display: flex;
    padding: 0 24px;
    max-height: calc(90vh - 70px - 56px);

    .left-side {
      width: 100%;
      padding: 20px 8px 40px;
      max-height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      .input-form-border {
        border-radius: 8px;
        border: 1px solid;
        height: 48px;
        padding: 12px 8px;
        font-weight: 400;
        font-size: 16px;
        &.v-texarea-normalize {
          height: auto;
        }
      }
      .input-block {
        display: flex;
        flex-flow: column;
        &.flex-input {
          flex-flow: row;
        }
        .input {
          &:focus {
            outline: none;
          }
        }
        .input-form-label {
          letter-spacing: 0.0015em;
          font-weight: 400;
          font-size: 16px;
        }
      }
    }
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
<style lang="scss">
.date-picker--mod {
  .mx-input-wrapper {
    min-width: 280px;
    .mx-input {
      height: 44px;
      border-radius: 8px;
    }
  }
}
</style>
