<template>
  <div class="each-news-card news_bg mb-0 py-3" style="height: fit-content">
    <p class="news-header neutral--text pointer">
      {{ title }}
    </p>
    <p class="news-publish-date neutral_color_sub1--text">
      {{ published_at ? formatDateDMYH(published_at) : "" }}
    </p>
    <div
      class="news-text neutral--text"
      :class="textOver9 ? 'news-text-over-lines' : ''"
    >
      <pre
        :ref="`pre-ref-${postId}`"
        style="line-height: 18px"
        :class="!isColapseText ? 'show-all' : ''"
        @click="toggleColapseText"
        >{{ content }}
      </pre>
      <span
        v-if="textOver9"
        class="primary--text font-weight-bold expand-text-btn pointer"
        @click="isColapseText = !isColapseText"
        >{{
          isColapseText
            ? sysLanguage.news.textExpand
            : sysLanguage.news.textColapse
        }}</span
      >
    </div>
    <!-- LINKS BLOCK -->
    <div
      v-if="links && links.length"
      class="news-links-block px-2 news_block_bg mb-2"
    >
      <div
        v-for="(link, i) in links.slice(0, this.linksShow)"
        :key="i"
        class="each-link-in-news"
      >
        <img
          src="@/assets/images/file-icon-link.svg"
          height="28px"
          :alt="link.title"
        />
        <a
          :href="link.url"
          class="semantic_info--text"
          target="_blank"
          download=""
          :title="link.title"
        >
          {{ link.title ? formatFileName(link.title) : "" }}
        </a>
      </div>
      <div
        v-if="links.length > 3 && linksShow < links.length"
        class="rest-links-counter semantic_info--text font-weight-bold pointer"
        @click="onExpandLinks"
      >
        + {{ links.length - 3 }} {{ sysLanguage.news.otherLinks }}...
      </div>
      <div
        v-if="links.length > 3 && linksShow >= links.length"
        class="rest-links-counter semantic_info--text font-weight-bold pointer"
        @click="onColapseLinks"
      >
        {{ sysLanguage.news.colapse }}
      </div>
    </div>
    <!-- FILES BLOCK -->
    <div
      v-if="attachments && attachments.length"
      class="news-files-block px-2 news_block_bg mb-2"
    >
      <div
        v-for="(file, i) in attachments.slice(0, this.attachmentsShow)"
        :key="i"
        class="each-file-in-news"
      >
        <img
          :src="file.extension ? getFileIcon(file.extension) : ''"
          height="28px"
          :alt="file.name"
        />
        <a
          :href="file.url"
          class="semantic_info--text"
          target="_blank"
          :title="file.original_name"
          download=""
        >
          {{ file.original_name ? formatFileName(file.original_name) : "" }}
        </a>
      </div>
      <div
        v-if="attachments.length > 3 && attachmentsShow < attachments.length"
        class="rest-files-counter semantic_info--text font-weight-bold pointer"
        @click="onExpandAttachments"
      >
        + {{ attachments.length - 3 }} {{ sysLanguage.news.otherFiles }}...
      </div>
      <div
        v-if="attachments.length > 3 && attachmentsShow > attachments.length"
        class="rest-files-counter semantic_info--text font-weight-bold pointer"
        @click="onColapseAttachments"
      >
        {{ sysLanguage.news.colapse }}
      </div>
    </div>
    <!-- IMAGES BLOCK -->
    <div
      v-if="photos && photos.length"
      class="news-images-block"
      :class="[layoutImage]"
    >
      <v-img
        v-for="(img, i) in photos.slice(0, 5)"
        :key="img.url"
        :src="img.url"
        lazy-src="@/assets/images/placeholder.png"
        :class="['news-image', `news-image-${i}`]"
        @click="previewImg(photosComputed, i)"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <span
        v-if="photos.length > 5"
        class="rest-img-counter"
        @click="previewImg(photosComputed, 4)"
        >+{{ photos.length - 4 }}</span
      >
    </div>
  </div>
</template>

<script>
import handleFiles from "@/mixins/handleFiles.js"
import { formatDateDMYH } from "@/helpers/dateFormater.js"
export default {
  components: {},
  mixins: [handleFiles],
  props: {
    showType: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      isColapseText: true,
      textOver9: false,
      // cmts state
      initStepComment: 3,
      commentStepCounter: 10,
      attachmentsShow: 3,
      linksShow: 3,
    }
  },
  computed: {
    reportMsg() {
      return `<span>Bạn muốn báo cáo bình luận của <b>${
        this.commentToReport.creator ? this.commentToReport.creator.name : ""
      }</b>? Vui lòng ghi rõ lý do:</span>`
    },
    postId() {
      return this.data && this.data.id ? this.data.id : -1
    },
    layoutImage() {
      const imgLength = this.photos.length
      if (imgLength < 6) {
        return `layout-image-${imgLength}`
      }
      return "layout-image-ow"
    },
    ableToLoadmore() {
      try {
        return this.totalComments > this.listComments.length
      } catch (error) {
        return false
      }
    },
    content() {
      return this.data.content
    },
    title() {
      return this.data.title
    },
    created_at() {
      return this.data.created_at
    },
    published_at() {
      return this.data.published_at
    },
    links() {
      return this.data.links || []
    },
    photos() {
      return this.data.photos || []
    },
    photosComputed() {
      return this.photos.map((o) => ({ url: o.url }))
    },
    attachments() {
      return this.data.attachments || []
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.getPostLineCount()
    })
  },
  methods: {
    onColapseLinks() {
      this.linksShow = 3
    },
    onExpandLinks() {
      this.linksShow = this.links.length + 1
    },
    onColapseAttachments() {
      this.attachmentsShow = 3
    },
    onExpandAttachments() {
      this.attachmentsShow = this.attachments.length + 1
    },
    //
    scrollToTypeArea() {
      if (document.querySelector(`#type-area-for-${this.data.id}`)) {
        document.querySelector(`#type-area-for-${this.data.id}`).focus()
      }
    },
    formatDateDMYH(_d) {
      return formatDateDMYH(_d)
    },
    toggleColapseText() {
      if (!this.textOver9) {
        return
      }
      this.isColapseText = !this.isColapseText
    },
    storeDetail() {
      this.$store.commit("setDetailNews", this.data)
      this.$router.push(`/news/${this.data.id}`)
    },
    getPostLineCount() {
      setTimeout(() => {
        const el = this.$refs[`pre-ref-${this.postId}`]
        if (!el) {
          return
        }
        const divHeight = el.offsetHeight
        const lineHeight = parseInt(el.style.lineHeight)

        const lines = divHeight / lineHeight
        if (lines > 9) {
          this.textOver9 = true
        }
      }, 10)
    },
  },
}
</script>
<style lang="scss" scoped>
.each-news-card {
  padding: 16px 16px 8px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.news-images-block {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  cursor: pointer;
  .rest-img-counter {
    display: none;
  }
  &.layout-image-1 {
    .news-image {
      flex-grow: 1;
      width: 100%;
      height: 470px;
    }
  }
  &.layout-image-2 {
    .news-image {
      flex-grow: 1;
      height: 470px;
    }
  }
  &.layout-image-3 {
    display: grid;
    grid-template-columns: 50%;
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 3;
      height: 406px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
  }
  &.layout-image-4 {
    .news-image {
      flex-grow: 1;
      width: calc(50% - 6px);
      max-width: calc(50% - 6px);
      height: 260px;
    }
  }
  &.layout-image-5 {
    display: grid;
    grid-template-columns: auto;
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 5;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 5;
      grid-column-end: 7;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-3 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .news-image-4 {
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
  }
  &.layout-image-ow {
    display: grid;
    grid-template-columns: calc(100% / 6);
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 5;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 5;
      grid-column-end: 7;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-3 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .news-image-4 {
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .rest-img-counter {
      display: flex;
      color: #fff;
      letter-spacing: 0.0025em;
      font-size: 34px;
      align-items: center;
      justify-content: center;
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
      background: #00000056;
      position: relative;
      z-index: 2;
    }
  }
}
.news-header {
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
  display: block;
  text-decoration: none;
}
.news-publish-date {
  font-size: 12px;
  font-weight: 150%;
  text-align: left;
  letter-spacing: 0.004em;
  margin-bottom: 16px;
}
.news-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  letter-spacing: 0.0025em;
  margin-bottom: 8px;
  .expand-text-btn {
    display: none;
  }
}
.news-text-over-lines {
  &.news-text {
    pre {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 9; /* number of lines to show */
      line-clamp: 9;
      -webkit-box-orient: vertical;
    }
    pre.show-all {
      -webkit-line-clamp: 9999999; /* number of lines to show */
      line-clamp: 9999999;
    }
  }
  .expand-text-btn {
    display: block;
    width: fit-content;
    /* transform: translateY(-100%); */
    margin-left: auto;
    text-align: right;
    &:hover {
      text-decoration: underline;
    }
  }
}
.news-statistical {
  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f2f2;
  gap: 20px;
  .like-counter {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.0025em;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .comment-counter {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.0025em;
    display: block;
    text-decoration: none;
  }
}
.news-files-block {
  padding: 16px 0;
  .each-file-in-news {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 4px 0;
    text-decoration: none;
    a {
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 143%;
      display: flex;
      align-items: center;
      letter-spacing: 0.0025em;
    }
  }
  .rest-files-counter {
    padding: 8px 0 4px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.news-links-block {
  padding: 16px 0;
  .each-link-in-news {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 4px 0;
    text-decoration: none;
    a {
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 143%;
      display: flex;
      align-items: center;
      letter-spacing: 0.0025em;
    }
  }
  .rest-links-counter {
    padding: 8px 0 4px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.load-more-cmts {
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  &:hover {
    text-decoration: underline;
  }
}
</style>
<style lang="scss">
pre {
  white-space: pre-wrap;
}
</style>
