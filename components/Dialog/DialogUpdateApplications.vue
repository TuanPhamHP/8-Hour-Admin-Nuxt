<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="970"
    style="border-radius: 8px"
  >
    <v-card class="create-position-dialog">
      <v-card-title class="primary px-4">
        <div class="d-flex align-center">
          <v-btn color="white" icon @click="cancelAction"
            ><v-icon size="20px">mdi-close</v-icon></v-btn
          >
          <span
            class="white--text dialog-title"
            style="font-size: 16px !important; font-weight: 400"
            >Cấp quyền truy cập hệ thống</span
          >
        </div>
      </v-card-title>
      <div class="dialog-body-content">
        <div class="left-side scroll-y-mod_big">
          <div class="each-top-info w-100 mb-4">
            <p class="mb-1 info-label neutral--text font-weight-500">
              Tên Module/ Hệ thống
            </p>
            <div class="info-input px-0 neutral_color_sub3--text">
              <SelectAuto
                :placeholder="'Tên Module/ Hệ thống'"
                :multiple="true"
                :onChange="onChangeApplications"
                :default-value="listAppIds"
                :options="applications"
                :clearAble="false"
                :chips="true"
                :deletable-chips="true"
                :select-all="true"
                :custom-class="'v-autocomplete-no-border w-100 v-autocomplete-size-16'"
              />
            </div>
          </div>
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
import SelectAuto from "@/components/Filter/SelectAuto"
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
    detailDataApplications: {
      type: Array,
      default() {
        return []
      },
    },
  },
  components: { SelectAuto },
  mixins: [handleFiles],
  data() {
    return {
      dialog: false,
      loadingBtn: false,
      submitClicked: false,
      company_id: null,
      department_id: null,
      listAppIds: [],
      name: "",
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
      applications: (state) => state.users.applications,
    }),
    ableToCreate() {
      return !!this.name && !!String(this.name).trim()
    },
  },
  watch: {
    isVisible() {
      this.resetData()
      this.dialog = this.isVisible
      this.listAppIds = this.detailDataApplications.map((o) => o.id)
    },
    detailDataApplications: {
      deep: true,
      handler() {
        this.listAppIds = this.detailDataApplications.map((o) => o.id)
      },
    },
  },
  mounted() {
    this.listAppIds = this.detailDataApplications.map((o) => o.id)
  },
  methods: {
    resetData() {},
    onChangeApplications(_val) {
      this.listAppIds = _val
    },
    onChangeDepartment(_val) {
      this.department_id = _val
    },
    toggleSelectAllModule() {},
    // USER HANDLER
    async onSubmit() {
      this.submitClicked = true

      const body = {
        application_ids: this.listAppIds,
      }
      this.loadingBtn = true
      const res = await api.applications.syncApplications(
        this.$route.params.id,
        body,
      )
      this.loadingBtn = false
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
.create-position-dialog {
  border-radius: 8px;
  .dialog-title {
    font-weight: 400;
    font-size: 16px !important;
    line-height: 28px;
  }
  .dialog-body-content {
    display: flex;
    padding: 0 24px;
    max-height: calc(90vh - 70px);
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
    .info-input {
      display: flex;
      align-items: center;
      border: 1px solid;
      border-radius: 8px;
      height: 48px;
      padding: 10px 12px;
    }
  }
}
</style>
<style lang="scss">
.create-position-dialog {
  border-radius: 8px !important;
}
</style>
