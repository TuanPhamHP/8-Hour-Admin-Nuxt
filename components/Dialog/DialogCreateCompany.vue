<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
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
            >Tạo Công ty mới</span
          >
        </div>
      </v-card-title>
      <div class="dialog-body-content">
        <div class="left-side scroll-y-mod_big">
          <div class="input-block pb-2">
            <label class="input-form-label font-weight-500 black--text pb-2">
              Công ty <span class="semantic_error--text">*</span></label
            >
            <input
              v-model="name"
              type="text"
              class="input input-form-border neutral_color_sub3 bg-white mb-2"
              :class="errorObj.name ? 'error-border' : ''"
              placeholder="Công ty"
            />
            <p
              v-if="errorObj.name"
              class="semantic_error--text error-msg-small mb-0"
            >
              {{ errorObj.name }}
            </p>
          </div>
          <div class="input-block pb-2">
            <label class="input-form-label font-weight-500 black--text pb-2">
              Tên viết tắt <span class="semantic_error--text">*</span></label
            >
            <input
              v-model="code"
              type="text"
              class="input input-form-border neutral_color_sub3 bg-white mb-2"
              :class="errorObj.code ? 'error-border' : ''"
              placeholder="Tên viết tắt"
            />
            <span
              class="small-charactor-count neutral_color_sub3--text"
              :class="
                code.length === limitSizeCodeName
                  ? 'reach-max semantic_error--text'
                  : ''
              "
            >
              {{ code.length }}/{{ limitSizeCodeName }}
            </span>
            <p
              v-if="errorObj.code"
              class="semantic_error--text error-msg-small mb-0"
            >
              {{ errorObj.code }}
            </p>
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
  components: {},
  mixins: [handleFiles],
  data() {
    return {
      dialog: false,
      loadingBtn: false,
      submitClicked: false,
      company_id: null,
      department_id: null,

      name: "",
      code: "",
      limitSizeCodeName: 5,
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
    }),
    ableToCreate() {
      return (
        !!this.name &&
        !!String(this.name).trim() &&
        !!this.code &&
        !!String(this.code).trim()
      )
      // return true
    },

    errorObjUnder() {
      const obj = {}
      if (!this.name || !String(this.name).trim()) {
        obj.name = "Không được để trống tên công ty"
      }
      if (this.code.length < 2) {
        obj.code = "Tên viết tắt tối thiểu 2 kí tự"
      }

      if (!this.code) {
        obj.code = "Không được để trống tên viết tắt"
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
    code() {
      if (this.code.length > this.limitSizeCodeName) {
        this.code = this.code.slice(0, this.limitSizeCodeName)
      }
    },
  },
  mounted() {},
  methods: {
    resetData() {
      this.submitClicked = false
      this.company_id = null
      this.department_id = null

      this.name = ""
      this.code = ""
    },

    // USER HANDLER
    async onSubmit() {
      this.submitClicked = true
      if (Object.keys(this.errorObjUnder).length) {
        return
      }
      const body = {
        name: this.name,
        code: this.code,
      }
      this.loadingBtn = true
      const res = await api.companies.create(body)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.createPositionFail,
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
          this.sysLanguage.snackbar.createPositionSuccess,
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
