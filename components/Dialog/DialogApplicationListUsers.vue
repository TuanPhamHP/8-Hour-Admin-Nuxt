<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="970"
    style="border-radius: 8px"
  >
    <v-card class="create-user-dialog">
      <v-card-title class="primary px-4">
        <div class="d-flex align-center">
          <span
            class="white--text dialog-title"
            style="font-size: 16px !important; font-weight: 400"
            >{{ data.name }}</span
          >
        </div>
        <v-btn color="white" class="ml-auto" icon @click="cancelAction"
          ><v-icon size="20px">mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <div class="dialog-body-content">
        <div class="left-side scroll-y-mod_big">
          <div class="input-block py-2">
            <label class="input-form-label black--text pb-2">
              Tên hệ thống
            </label>
            <input
              v-model="groupName"
              type="text"
              class="input input-form-border neutral_color_sub3 bg-white mb-2"
              :class="errorObj.groupName ? 'error-border' : ''"
              placeholder="Nhập tên nhóm"
              readonly
            />
            <p
              v-if="errorObj.groupName"
              class="semantic_error--text error-msg-small mb-0"
            >
              {{ errorObj.groupName }}
            </p>
            <span
              class="small-charactor-count neutral_color_sub3--text"
              :class="
                groupName.length === limitGroupNameLength
                  ? 'reach-max semantic_error--text'
                  : ''
              "
            >
              {{ groupName.length }}/{{ limitGroupNameLength }}
            </span>
          </div>
          <div class="filter-wr mb-2">
            <div
              class="filter-input input-form-border neutral_color_sub3 bg-white"
            >
              <input
                v-model="contactSearchQuery"
                type="text"
                :placeholder="sysLanguage.placeholder.textSearch"
                class="input-no-focus font-size-16 input"
              />
              <v-icon color="neutral" size="20">mdi-magnify</v-icon>
            </div>
          </div>
          <div class="d-flex align-center">
            <p class="mb-0 mr-2 neutral--text" style="white-space: nowrap">
              Danh sách người truy cập
              {{ listUserIds.length ? `(${listUserIds.length})` : `` }}
            </p>
            <v-btn
              color="primary"
              text
              height="48px"
              class="primary_light primary_light-opacity btn-add-group low-letter-spacing font-weight-bold"
              style="border-radius: 8px"
              @click="onAddUser"
            >
              <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
              {{ sysLanguage.button.addAppUser }}
            </v-btn>
          </div>
          <p
            v-if="errorObj.listUsers"
            class="semantic_error--text error-msg-small mb-0 text-left mt-1"
          >
            {{ errorObj.listUsers }}
          </p>
          <v-row class="list-user mt-3 m-0">
            <v-list-item
              v-for="user in listUserSelectedComputed"
              :key="user.id"
              class="p-0 list-contact__wr col-6"
            >
              <UserCardBin
                :user="user"
                :userClick="toggleUser"
                :isNavigate="true"
              />
            </v-list-item>
            <v-list-item
              v-if="
                !listUserSelectedComputed || !listUserSelectedComputed.length
              "
              class="no-user-filter_wr d-flex flex-column align-center"
            >
              <img
                src="@/assets/images/no-user-filter.svg"
                alt="no-user-filter"
                style="max-width: 90%"
              />
              <p class="no-user__text neutral_color_sub2--text">
                Không có kết quả nào phù hợp
              </p>
            </v-list-item>
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
          {{ sysLanguage.button.update }}
        </v-btn>
      </div>
    </v-card>
    <DialogAddUser
      :isVisible="showAddUserDialog"
      :confirmAction="addUser"
      :cancelAction="closeAddUserDialog"
      :usersDefaultIds="listUserIds"
    />
  </v-dialog>
</template>

<script>
import handleFiles from "@/mixins/handleFiles.js"
import DialogAddUser from "@/components/Dialog/DialogAddUser.vue"
import UserCardBin from "@/components/ContactSidebar/UserCardBin.vue"
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
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: { DialogAddUser, UserCardBin },
  mixins: [handleFiles],
  data() {
    return {
      contactSearchQuery: "",
      showAddUserDialog: false,
      dialog: false,
      loadingBtn: false,
      submitClicked: false,
      groupName: "",
      limitGroupNameLength: 60,
      listUserIds: [],
      advanceFilter: false,
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
    }),
    listUserSelectedComputed() {
      const _textQuery = String(this.contactSearchQuery).trim()
      const listUsers = this.listUsers.filter((o) =>
        this.listUserIds.includes(o.id),
      )
      if (!this.advanceFilter) {
        if (!_textQuery) {
          return listUsers
        } else {
          return listUsers
            .filter((o) => {
              return this.matchTextNoAscent(this.contactSearchQuery, o.name)
            })
            .map((o) => ({
              ...o,
              hlName: this.highlightMatchTextNoAscent(
                this.contactSearchQuery,
                o.name,
              ),
            }))
        }
      } else {
        let rslt = listUsers
          .filter((o) => {
            return this.matchTextNoAscent(this.contactSearchQuery, o.name)
          })
          .map((o) => ({
            ...o,
            hlName: this.highlightMatchTextNoAscent(
              this.contactSearchQuery,
              o.name,
            ),
          }))
        if (this.filterCompany) {
          rslt = rslt.filter((o) => +o.company_id === +this.filterCompany)
        }
        if (this.filterDepartment) {
          rslt = rslt.filter(
            (o) =>
              o.position &&
              +o.position.department_id === +this.filterDepartment,
          )
        }
        if (this.filterPosition) {
          rslt = rslt.filter((o) => +o.position_id === +this.filterPosition)
        }
        return rslt
      }
    },
    ableToCreate() {
      // return (
      //  this.listUserIds && this.listUserIds.length
      // )
      return true
    },
    errorObjUnder() {
      const obj = {}
      // if (!this.groupName || !String(this.groupName).trim()) {
      //   obj.groupName = "Không được để trống tiêu đề"
      // }
      // if (
      //   !this.listUserSelectedComputed ||
      //   !this.listUserSelectedComputed.length
      // ) {
      //   obj.listUsers = "Không được để trống thành viên"
      // }
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
    groupName() {
      if (this.groupName.length > this.limitGroupNameLength) {
        this.groupName = this.groupName.slice(0, this.limitGroupNameLength)
      }
    },
    data: {
      deep: true,
      handler() {
        if (this.data && this.data.id) {
          this.syncData()
        }
      },
    },
  },
  mounted() {
    if (this.data && this.data.id) {
      this.syncData()
    }
  },
  methods: {
    syncData() {
      if (!this.data || !this.data.id) {
        this.resetData()
        return
      }
      this.groupName = this.data.name

      if (this.data.users && this.data.users.length) {
        this.listUserIds = [...this.data.users.map((o) => o.id)]
      }
    },
    resetData() {
      this.showAddUserDialog = false
      this.loadingBtn = false
      this.submitClicked = false
      this.contactSearchQuery = ""
      this.listUserIds = []
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
    toggleUser(_user) {
      console.log(_user)
      if (this.listUserIds.includes(_user.id)) {
        this.listUserIds = this.listUserIds.filter((o) => o !== _user.id)
      } else {
        this.listUserIds.push(_user.id)
      }
    },
    // USER HANDLER
    async onSubmit() {
      this.submitClicked = true
      if (Object.keys(this.errorObjUnder).length) {
        return
      }
      const body = {
        user_ids: [...this.listUserIds],
      }
      this.loadingBtn = true
      const res = await api.applications.syncApplicationUsers(
        this.data.id,
        body,
      )
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.updateApplicationUsersFail,
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
          this.sysLanguage.snackbar.updateApplicationUsersSuccess,
        )
        this.$store.dispatch("getListApplications")

        this.confirmAction()
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
    max-height: calc(90vh - 70px - 54px);
    min-height: calc(90vh - 70px - 54px);
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
