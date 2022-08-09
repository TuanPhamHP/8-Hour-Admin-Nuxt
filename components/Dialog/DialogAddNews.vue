<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1440"
    style="border-radius: 8px"
  >
    <v-card class="add-news-dialog">
      <v-card-title class="primary px-4">
        <div class="d-flex align-center">
          <v-btn color="white" icon @click="cancelAction"
            ><v-icon size="20px">mdi-close</v-icon></v-btn
          >
          <span
            class="white--text dialog-title"
            style="font-size: 16px !important; font-weight: 400"
            >Tạo bản tin mới</span
          >
        </div>
        <div class="ml-auto">
          <v-btn
            text
            color="white"
            :disabled="loadingBtn"
            @click="handlePreviewNews"
          >
            Xem trước
          </v-btn>
        </div>
        <div>
          <v-btn text color="white" :loading="loadingBtn" @click="onSubmit">
            Đăng bản tin
          </v-btn>
        </div>
      </v-card-title>
      <div class="dialog-body-content">
        <div class="left-side scroll-y-mod_big">
          <div class="input-block py-2">
            <label class="input-form-label black--text pb-2"> Tiêu đề </label>
            <input
              v-model="title"
              type="text"
              class="input input-form-border neutral_color_sub3 bg-white mb-2"
              :class="errorObj.title ? 'error-border' : ''"
              placeholder="Tiêu đề bản tin"
            />
            <p
              v-if="errorObj.title"
              class="semantic_error--text error-msg-small mb-0"
            >
              {{ errorObj.title }}
            </p>
            <span
              class="small-charactor-count neutral_color_sub3--text"
              :class="
                title.length === limitTitleLength
                  ? 'reach-max semantic_error--text'
                  : ''
              "
            >
              {{ title.length }}/{{ limitTitleLength }}
            </span>
          </div>
          <div
            class="input-block flex-input align-center py-2"
            style="height: 60px"
          >
            <v-radio-group
              v-model="publishId"
              class="m-0 p-0 d-flex flex-radio-group"
              hide-details
              colo
              row
            >
              <v-radio
                color="semantic_info"
                :label="'Đăng ngay'"
                :value="1"
                :active-class="'semantic_info--text'"
              >
                <template v-slot:label>
                  <label
                    class="pointer"
                    :class="
                      publishId === 1
                        ? 'semantic_info--text'
                        : 'neutral_color_sub3--text'
                    "
                    >Đăng ngay</label
                  >
                </template></v-radio
              >
              <v-radio color="semantic_info" :label="'Hẹn giờ'" :value="2">
                <template v-slot:label>
                  <label
                    class="pointer"
                    :class="
                      publishId === 2
                        ? 'semantic_info--text'
                        : 'neutral_color_sub3--text'
                    "
                    >Hẹn giờ</label
                  >
                </template>
              </v-radio>
            </v-radio-group>
            <div v-if="publishId === 2" class="date-picker--mod">
              <DateTimePicker
                :onChange="onChangeTime"
                :defaultDate="publishTime"
              ></DateTimePicker>
            </div>
          </div>
          <!-- CONTENT -->
          <div class="input-block py-2">
            <label class="input-form-label black--text pb-2"> Nội dung </label>

            <v-textarea
              v-model="content"
              dense
              auto-grow
              hide-details
              placeholder="Văn bản"
              class="v-texarea-normalize my-0 input-form-border input neutral_color_sub3 bg-white"
              :class="errorObj.content ? 'error-border' : ''"
              rows="4"
            >
            </v-textarea>
            <p
              v-if="errorObj.content"
              class="semantic_error--text error-msg-small mb-0"
            >
              {{ errorObj.content }}
            </p>
          </div>
          <!-- LINKS -->
          <div class="input-block py-2">
            <label class="input-form-label black--text pb-2"> Link </label>

            <div class="list-links">
              <div class="each-link" v-for="(link, idx) in links" :key="idx">
                <input
                  v-model="link.title"
                  type="text"
                  class="link-input link-name focus-no-outline"
                  placeholder="Tên"
                />
                <input
                  v-model="link.url"
                  type="text"
                  class="link-input link-url focus-no-outline semantic_info--text"
                  placeholder="Đường dẫn"
                  :title="link.url"
                />
                <v-btn color="neutral" icon @click="removeLink(idx)"
                  ><v-icon size="20px">mdi-trash-can-outline</v-icon></v-btn
                >
              </div>
              <v-btn
                color="primary"
                depressed
                style="border-radius: 8px"
                @click="addLink"
              >
                <v-icon size="20px" class="mr-1">mdi-link</v-icon> Thêm Link
              </v-btn>
            </div>
          </div>
          <!-- FILES -->
          <div class="input-block py-2">
            <label class="input-form-label black--text pb-2"> Files </label>

            <div class="list-files">
              <div
                class="each-file align-center"
                v-for="(file, idx) in fileClipBoard"
                :key="idx"
              >
                <img
                  :src="file.extension ? getFileIcon(file.extension) : ''"
                  height="28px"
                  :alt="file.name"
                />
                <span
                  class="semantic_info--text"
                  target="_blank"
                  :title="file.original_name"
                  download=""
                >
                  {{
                    file.original_name
                      ? formatFileNameLocal(file.original_name)
                      : ""
                  }}
                </span>
                <v-btn
                  class="ml-auto"
                  color="neutral"
                  icon
                  @click="removeFile(idx)"
                  ><v-icon size="20px">mdi-trash-can-outline</v-icon></v-btn
                >
              </div>
              <v-btn
                color="primary"
                depressed
                style="border-radius: 8px"
                @click="addFile"
              >
                <v-icon size="20px" class="mr-1">mdi-paperclip</v-icon> Thêm
                File
              </v-btn>
            </div>
          </div>
          <!-- IMAGES -->
          <div class="input-block py-2">
            <label
              class="input-form-label black--text pb-2 d-flex align-center"
            >
              Ảnh
              <!-- <v-checkbox
                class="mt-0 ml-3"
                hide-details
                v-model="imageFirst"
                :label="`Hiển thị lên đầu bản tin`"
              ></v-checkbox> -->
            </label>

            <div class="list-images">
              <div
                class="each-file align-center"
                v-for="(file, idx) in imagesClipBoard"
                :key="idx"
              >
                <img :src="file.src" class="prv-image" :alt="file.name" />
                <span
                  class="semantic_info--text"
                  target="_blank"
                  :title="file.original_name"
                  download=""
                >
                  {{
                    file.original_name
                      ? formatFileNameLocal(file.original_name)
                      : ""
                  }}
                </span>
                <v-btn
                  class="ml-auto"
                  color="neutral"
                  icon
                  @click="removeImage(idx)"
                  ><v-icon size="20px">mdi-trash-can-outline</v-icon></v-btn
                >
              </div>
              <v-btn
                color="primary"
                depressed
                style="border-radius: 8px"
                @click="addImage"
              >
                <v-icon size="20px" class="mr-1">mdi-image-plus</v-icon> Thêm
                ảnh
              </v-btn>
            </div>
          </div>
        </div>
        <div class="right-side news_block_bg">
          <div class="px-2 py-2">
            <v-btn
              color="primary"
              text
              height="48px"
              class="primary_light primary_light-opacity btn-add-group w-100"
              @click="onAddUser"
            >
              <v-icon color="primary" class="mr-2">mdi-plus</v-icon>
              {{ sysLanguage.button.addNewReceiver }}
            </v-btn>
          </div>
          <div class="neutral_color_sub5" style="height: 1px"></div>
          <p
            v-if="errorObj.listUsers"
            class="semantic_error--text error-msg-small mb-0 text-center"
          >
            {{ errorObj.listUsers }}
          </p>
          <v-list
            v-if="listUserIds && listUserIds.length"
            dense
            class="px-2 pt-0 pb-2 list-users-selected news_block_bg"
          >
            <p class="user-counter pt-2">
              {{ sysLanguage.title.receiverCounter }} ({{
                listUserSelectedComputed.length
              }})
            </p>
            <v-list-item
              v-for="user in listUserSelectedComputed"
              :key="user.id"
              class="px-0 list-contact__wr"
            >
              <UserCardBin :user="user" :userClick="toggleUser" />
            </v-list-item>
          </v-list>
        </div>
      </div>
      <input
        id="files-input-news-create"
        class="d-none"
        type="file"
        multiple
        accept="*"
        @change="onFileChange"
      />
      <input
        id="images-input-news-create"
        class="d-none"
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.svg"
        @change="onImageChange"
      />
    </v-card>

    <DialogAddUserWithGroups
      :isVisible="showAddUserDialog"
      :confirmAction="addUser"
      :cancelAction="closeAddUserDialog"
      :usersDefaultIds="listUserIds"
    />
  </v-dialog>
</template>

<script>
import DialogAddUserWithGroups from "@/components/Dialog/DialogAddUserWithGroups.vue"
import UserCardBin from "@/components/ContactSidebar/UserCardBin.vue"
import DateTimePicker from "../DateTimePicker.vue"
import handleFiles from "@/mixins/handleFiles.js"
import api from "@/services"
import { tDate } from "validation_t/src"
import { mapState } from "vuex"
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    showPreviewNews: {
      type: Function,
      default() {},
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
  components: { DateTimePicker, DialogAddUserWithGroups, UserCardBin },
  mixins: [handleFiles],
  data() {
    return {
      dialog: false,
      loadingBtn: false,
      showAddUserDialog: false,
      limitTitleLength: 120,
      imageFirst: false,
      publishId: 1,
      publishTime: "",
      title: "",
      content: "",
      imagesClipBoard: [],
      fileClipBoard: [],
      submitClicked: false,
      listUserIds: [],
      fileLimit: {
        size: 100 * 1024 * 1024,
      },
      links: [
        {
          title: "",
          url: "",
        },
      ],
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
    }),
    publishTimeFormat() {
      // 2022-04-25 16:00
      const objDate = tDate.formatDateCustomize(this.publishTime)
      return this.publishTime
        ? `${objDate.yyyy}-${objDate.MM}-${objDate.dd} ${objDate.hh}:${objDate.mm}`
        : ""
    },
    linksComputed() {
      return this.links.filter(
        (o) => String(o.title).trim() && String(o.url).trim(),
      )
    },
    listUserSelectedComputed() {
      return this.listUsers.filter((o) => this.listUserIds.includes(o.id))
    },
    errorObjUnder() {
      const obj = {}
      if (!this.title || !String(this.title).trim()) {
        obj.title = "Không được để trống tiêu đề"
      }
      if (!this.content || !String(this.content).trim()) {
        obj.content = "Không được để trống nội dung"
      }
      if (
        !this.listUserSelectedComputed ||
        !this.listUserSelectedComputed.length
      ) {
        obj.listUsers = "Không được để trống người nhận"
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
    title() {
      if (this.title.length > this.limitTitleLength) {
        this.title = this.title.slice(0, this.limitTitleLength)
      }
    },
  },
  mounted() {},
  methods: {
    resetData() {
      this.showAddUserDialog = false
      this.imageFirst = false
      this.publishId = 1
      this.publishTime = ""
      this.title = ""
      this.content = ""
      this.imagesClipBoard = []
      this.fileClipBoard = []
      this.submitClicked = false
      this.listUserIds = []
      this.links = [
        {
          title: "",
          url: "",
        },
      ]
    },
    onChangeTime(time) {
      if (!time) {
        this.publishTime = ""
        return
      }
      this.publishTime = time
      console.log(time)
    },

    removeLink(idx) {
      this.links.splice(idx, 1)
    },
    removeFile(idx) {
      this.fileClipBoard.splice(idx, 1)
    },
    removeImage(idx) {
      this.imagesClipBoard.splice(idx, 1)
    },
    addLink() {
      this.links.push({
        title: "",
        url: "",
      })
    },
    addFile() {
      document.querySelector("#files-input-news-create").value = null
      document.querySelector("#files-input-news-create").click()
    },
    addImage() {
      document.querySelector("#images-input-news-create").value = null
      document.querySelector("#images-input-news-create").click()
    },
    clearCacheFile() {
      try {
        document.getElementById("files-input-news-create").value = null
      } catch (error) {
        console.log(error)
      }
    },
    onFileChange(event) {
      const files = event.target.files
      for (const file of files) {
        console.log(file)
        if (file.size > this.fileLimit.size) {
          this.$store.commit(
            "toast/getError",
            file.name + ": " + this.sysLanguage.snackbar.fileOverSizeLimit,
          )
        } else {
          const reader = new FileReader()
          reader.onload = (event) => {
            // const img = document.createElement("img")
            // img.src = event.target.result
            // const { width, height } = await getImageDimensions(img);
            const _id = `${new Date().getTime()}_${Math.random()}`

            this.fileClipBoard.push({
              _id,
              original_name: file.name,
              src: event.target.result,
              extension: file.name.split(".").pop(),
              blob: file,
              sizes: file.size,
              status: "queue",
            })
          }
          reader.readAsDataURL(file)
        }
      }
    },
    onImageChange(event) {
      const files = event.target.files
      for (const file of files) {
        console.log(file)
        if (file.size > this.fileLimit.size) {
          this.$store.commit(
            "toast/getError",
            file.name + ": " + this.sysLanguage.snackbar.fileOverSizeLimit,
          )
        } else {
          const reader = new FileReader()
          reader.onload = (event) => {
            const _id = `${new Date().getTime()}_${Math.random()}`

            this.imagesClipBoard.push({
              _id,
              original_name: file.name,
              src: event.target.result,
              extension: file.name.split(".").pop(),
              blob: file,
              sizes: file.size,
              status: "queue",
            })
          }
          reader.readAsDataURL(file)
        }
      }
    },
    handlePreviewNews() {
      const body = {
        title: this.title,
        content: this.content,
        photos: [],
        links: [],
        attachments: [],
      }
      if (this.imagesClipBoard && this.imagesClipBoard.length) {
        body.photos = [
          ...body.photos,
          ...this.imagesClipBoard.map((o) => ({
            ...o,
            url: o.src,
            extension: "jpg",
          })),
        ]
      }
      if (this.fileClipBoard && this.fileClipBoard.length) {
        body.attachments = [
          ...body.attachments,
          ...this.fileClipBoard.map((o) => ({
            ...o,
          })),
        ]
      }
      if (this.linksComputed && this.linksComputed.length) {
        body.links = [...body.links, ...this.linksComputed]
      }
      this.showPreviewNews(body)
    },
    // USER HANDLER
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
    async onSubmit() {
      this.submitClicked = true
      if (Object.keys(this.errorObjUnder).length) {
        return
      }
      const formData = new FormData()
      formData.append("title", this.title)
      formData.append("content", this.content)
      if (this.publishId === 2) {
        formData.append("scheduled_at", this.publishTimeFormat)
      }
      if (this.imagesClipBoard && this.imagesClipBoard.length) {
        this.imagesClipBoard.forEach((o) => {
          formData.append("photos[]", o.blob)
        })
      }
      if (this.fileClipBoard && this.fileClipBoard.length) {
        this.fileClipBoard.forEach((o) => {
          formData.append("attachments[]", o.blob)
        })
      }
      if (this.listUserIds && this.listUserIds.length) {
        this.listUserIds.forEach((o) => {
          formData.append("recipient_ids[]", o)
        })
      }
      if (this.linksComputed && this.linksComputed.length) {
        this.linksComputed.forEach((o, idx) => {
          formData.append(`links[${idx}][title]`, o.title)
          formData.append(`links[${idx}][url]`, o.url)
        })
      }
      this.loadingBtn = true
      const res = await api.annoucement.create(formData)
      this.loadingBtn = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.createNewsFail,
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
          this.sysLanguage.snackbar.createNewsSuccess,
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
.add-news-dialog {
  .dialog-title {
    font-weight: 400;
    font-size: 16px !important;
    line-height: 28px;
  }
  .dialog-body-content {
    display: flex;
    padding: 0 24px;
    max-height: calc(90vh - 70px);
    min-height: calc(90vh - 70px);
    .left-side {
      width: 70%;
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
      .list-links {
        .each-link {
          width: 100%;
          display: flex;
          gap: 24px;
          margin-bottom: 8px;
          .link-input {
            width: calc(100% - 20px);
            border-radius: 8px;
            border: 1px solid #b3b3b3;
            padding: 4px 8px;
            height: 48px;
          }
        }
      }
      .list-files {
        .each-file {
          width: 100%;
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          border-radius: 8px;
          border: 1px solid #b3b3b3;
          padding: 4px 8px;
        }
      }
      .list-images {
        .each-file {
          width: 100%;
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          border-radius: 8px;
          border: 1px solid #b3b3b3;
          padding: 4px 8px;
        }
        .prv-image {
          height: 120px;
          width: 120px;
          object-fit: cover;
        }
      }
    }
    .right-side {
      width: 30%;
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
