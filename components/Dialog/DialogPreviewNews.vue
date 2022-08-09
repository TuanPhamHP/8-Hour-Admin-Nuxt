<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1440"
    style="border-radius: 8px"
  >
    <v-card class="preview-news-dialog">
      <v-card-title class="primary px-4">
        <div class="d-flex align-center">
          <span
            class="white--text dialog-title"
            style="font-size: 16px !important; font-weight: 400"
            >Xem trước bản tin</span
          >
        </div>
        <div class="ml-auto">
          <v-btn color="white" icon @click="cancelAction"
            ><v-icon size="20px">mdi-close</v-icon></v-btn
          >
        </div>
      </v-card-title>

      <div class="dialog-body-content scroll-y-mod_big">
        <NewsCardPreview :data="data" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import NewsCardPreview from "@/components/News/NewsCardPreview.vue"
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
  components: { NewsCardPreview },
  data() {
    return {
      dialog: false,
      loadingBtn: false,
    }
  },
  computed: {},
  watch: {
    isVisible() {
      this.dialog = this.isVisible
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
        return
      }
      this.title = this.data.title
      this.content = this.data.content
      if (this.data.links && this.data.links.length) {
        this.links = [...this.data.links]
      }
      if (this.data.photos && this.data.photos.length) {
        this.imagesClipBoardFromDetail = [...this.data.photos]
      }
      if (this.data.attachments && this.data.attachments.length) {
        this.fileClipBoardFromDetail = [...this.data.attachments]
      }
      if (this.data.recipients && this.data.recipients.length) {
        this.listUserIds = [...this.data.recipients.map((o) => o.id)]
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.preview-news-dialog {
  .dialog-title {
    font-weight: 400;
    font-size: 16px !important;
    line-height: 28px;
  }
  .dialog-body-content {
    display: flex;
    padding: 0 24px 30px;

    max-height: calc(90vh - 70px);
    min-height: calc(90vh - 70px);
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
<style lang="scss"></style>
