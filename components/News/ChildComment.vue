<template>
  <div class="news-comments-group pt-0">
    <div
      v-if="isShowComment && ableToLoadmore && !loadingComment"
      class="load-more-cmts mb-2 pointer neutral--text font-weight-semibold"
      @click="loadMoreCmts"
    >
      {{ sysLanguage.news.loadMoreChildComment }}
      <div
        v-if="loadingLoadmore && fLoadTotal"
        class="ml-1"
        style="width: fit-content"
      >
        <v-progress-circular
          indeterminate
          :width="2"
          :size="15"
          color="neutral"
        ></v-progress-circular>
      </div>
    </div>
    <div
      v-for="comment in listCommentsComputed"
      :key="comment.id"
      :id="`news-comment-id-${comment.id}`"
      :class="[comment.unsolveReport ? 'still-unsolve-report' : '']"
      class="each-news-comment child"
    >
      <RegularAvatarVue
        :size="36"
        :abbr-name="comment.creator.name"
        :imageUrl="comment.creator.avatar ? comment.creator.avatar.url : ''"
      />
      <div
        class="comment-block"
        :class="[
          comment.is_fake ? 'pending-cmt' : '',
          comment.id === selectedCmt.id ? 'on-edit-comment' : '',
        ]"
      >
        <div
          class="comment-block-text"
          :class="[
            comment.id === selectedCmt.id ? 'w-100' : '',
            comment.unsolveReport ? 'semantic_error--text' : 'app_bg',
          ]"
        >
          <p class="creator-name font-weight-bold neutral--text">
            {{ comment.creator ? comment.creator.name : "Unknow" }}
          </p>
          <div>
            <pre
              v-show="comment.id !== selectedCmt.id"
              class="comment-block-text-part font-weight-regular neutral--text"
              v-html="comment.content ? parseCommentText(comment.content) : ''"
              :class="showAllIds.includes(comment.id) ? 'show-all' : ''"
            ></pre>
            <span
              v-if="comment.over9"
              class="primary--text font-weight-bold expand-text-btn pointer"
              @click="triggerShowAll(comment)"
              >{{
                showAllIds.includes(comment.id)
                  ? sysLanguage.news.textColapse
                  : sysLanguage.news.textExpand
              }}</span
            >
          </div>
          <p
            v-show="comment.total_likes"
            class="mb-0 total-like-cmt pointer ml-auto neutral--text box-shadow--mod-lighter app_bg"
            @click="getListLikesCmt(comment)"
          >
            <img
              src="@/assets/images/comment-likes-counter.svg"
              alt="thumb-up"
              height="16px"
            />
            {{ comment.total_likes }}
          </p>
        </div>
        <div v-if="comment.file" class="comment-block-img my-1 pointer">
          <img
            :src="comment.file"
            class="block-img"
            alt=""
            loading="lazy"
            @click="previewImg([{ url: comment.file }], 0)"
            @error="replaceByDefault"
          />
        </div>
        <!-- CMT EDIT -->
        <div v-show="comment.id === selectedCmt.id" class="comment-actions">
          <p class="mb-0 edit-desc neutral--text pointer">
            Nhấn esc để
            <span class="semantic_error--text pointer" @click="clearSelectedCmt"
              >Hủy</span
            >
          </p>
        </div>
        <!--  -->
        <div
          v-show="comment.id !== selectedCmt.id"
          class="comment-actions"
          :class="comment.is_fake ? 'comment-actions__fk' : ''"
        >
          <p
            v-if="comment.unsolveReport"
            class="mb-0 like-cmt pointer neutral--text"
            @click="handlerReport(comment, 'disapprove')"
          >
            {{ sysLanguage.news.hold }}
          </p>
          <p
            v-if="comment.unsolveReport"
            class="mb-0 rep-cmt semantic_error--text pointer"
            @click="handlerReport(comment, 'approve')"
          >
            {{ sysLanguage.news.remove }}
          </p>
          <p class="mb-0 time-cmt neutral_color_sub1--text">
            {{
              comment.is_fake
                ? "Đang gửi..."
                : convertTimeRv(comment.created_at)
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="loadingComment && fLoadTotal"
      class="mx-auto"
      style="width: fit-content"
    >
      <v-progress-circular
        indeterminate
        :width="2"
        :size="24"
        color="neutral"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { convertTimeRv } from "@/helpers/dateFormater.js"
import RegularAvatarVue from "../User/RegularAvatar.vue"
import handleFiles from "@/mixins/handleFiles"
import comments from "@/mixins/comments"
import api from "@/services"
import { mapGetters, mapState } from "vuex"
export default {
  components: { RegularAvatarVue },
  mixins: [handleFiles, comments],
  props: {
    parentId: {
      type: Number,
      default: -1,
    },
    postId: {
      type: Number,
      default: -1,
    },
    fLoadTotal: {
      type: Number,
      default: 1,
    },
    setCommentRep: {
      type: Function,
      default() {},
    },
    reportComment: {
      type: Function,
      default() {},
    },
    commentRepFromParent: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      selectedCmt: {},
      showConfirmRemoveComment: false,
      selectedCmtToRemove: {},
      loadingRemove: false,
      isShowComment: false,
      loadingComment: false,
      loadingLoadmore: false,
      listComments: [],
      totalComments: 1,
      initStepComment: 3,
      commentStepCounter: 10,

      showAllIds: [],
      isColapseText: true,
    }
  },
  computed: {
    ...mapState({
      refChildCommentReport: (state) => state.news.refChildCommentReport,
    }),
    ...mapGetters({
      userFromAuth: "userFromAuth",
    }),
    ableToLoadmore() {
      try {
        return this.totalComments > this.listComments.length
      } catch (error) {
        return false
      }
    },
    listCommentsComputed() {
      return this.listComments.map((o) => ({
        ...o,
        unsolveReport: this.countUnsolveReport(o),
        over9: this.getCmtLineCount(o),
      }))
    },
  },
  watch: {
    refChildCommentReport() {
      if (this.refChildCommentReport === this.parentId) {
        this.onShowComment(true)
      }
    },
  },
  mounted() {
    this.onShowComment()
  },

  methods: {
    countUnsolveReport(cmt) {
      if (!cmt.reports || !cmt.reports.length) {
        return 0
      }
      return cmt.reports.filter((o) => o.status && o.status.id === 1).length
    },
    triggerShowAll(comment) {
      if (!comment.over9) {
        return
      }
      if (!this.showAllIds.includes(comment.id)) {
        this.showAllIds.push(comment.id)
        return
      } else {
        this.showAllIds = this.showAllIds.filter((o) => o !== comment.id)
        return
      }
    },
    getCmtLineCount(comment) {
      if (!comment.content) {
        return
      }
      const enterCounter = comment.content.split("\n").length
      const nsbpCounter = comment.content.split("&nbsp").length
      return (
        comment.content &&
        (comment.content.length > 600 || enterCounter + nsbpCounter > 9)
      )
    },
    async loadMoreCmts() {
      this.loadingLoadmore = true
      const nextCount = this.listComments.length + this.commentStepCounter
      const payload = { size: nextCount }
      const res = await api.annoucement.getListCommentsL2(
        this.postId,
        this.parentId,
        payload,
      )
      this.loadingLoadmore = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getNewsCommentsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        const dataObj = res.data.data
        this.listComments = dataObj.announcement_comments
        this.totalComments = dataObj.meta ? dataObj.meta.pagination.total : 0
      } catch (error) {
        this.$store.commit("toast/getError", String(error))
      }
    },
    async onShowComment(forcedCall = false) {
      // First load only
      if (this.isShowComment && !forcedCall) {
        return
      }
      const payload = { size: this.initStepComment }
      this.isShowComment = true
      this.loadingComment = true
      const res = await api.annoucement.getListCommentsL2(
        this.postId,
        this.parentId,
        payload,
      )

      this.loadingComment = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getNewsCommentsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        const dataObj = res.data.data
        this.listComments = dataObj.announcement_comments
        this.totalComments = dataObj.meta ? dataObj.meta.pagination.total : 0
      } catch (error) {
        this.$store.commit("toast/getError", String(error))
      }
    },
    localSubmit(_cmt) {
      this.listComments.push(_cmt)
      // this.listComments.splice(0, 0, _cmt)
    },

    convertTimeRv(_date) {
      return convertTimeRv(_date)
    },
    isMe(_user) {
      if (!_user) {
        return false
      }
      return _user.id === this.userFromAuth.id
    },
    clearSelectedCmt() {
      this.selectedCmt = {}
    },
    removeDataLocal(_cmt) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id)
      if (index !== -1) {
        this.listComments.splice(index, 1)
      }
    },
    resolveSubmitLocal(_cmt) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id)
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt)
      }
    },
    resolveEditLocal(_cmt, _formData) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id)
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt)
      }
      this.svEdit(_cmt.id, _formData)
    },
    async getListLikesCmt(comment) {
      const _aId = this.$route.params.id
      const _cId = comment.id
      const res = await api.annoucement.getListLikesCmt(_aId, _cId)
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getNewsLikesFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        if (res.data.data.likes && res.data.data.likes.length) {
          const arr = res.data.data.likes.map((o) => o.creator)
          this.$store.commit("SET_LISTUSER_READONLY_POPUP", [...arr])
        }
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
        console.error(error)
      }
    },
    async handlerReport(comment, type) {
      if (this.loadingRemove) {
        return
      }
      const reportAr = comment.reports.filter(
        (o) => o.status && o.status.id === 1,
      )
      const reportId = reportAr && reportAr.length ? reportAr[0].id : 0
      this.loadingRemove = true
      const res = await api.annoucement.handlerReport(this.postId, reportId, {
        type,
      })
      this.loadingRemove = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.handlerReportFail,
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
          this.sysLanguage.snackbar.handlerReportSuccess,
        )
        this.onShowComment(true)
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.news-comments-group {
  gap: 30px;
  padding: 10px 0;
  .each-news-comment {
    display: flex;
    gap: 8px;
  }
  .comment-block {
    padding-right: 32px;
    &.on-edit-comment {
      width: 100% !important;
    }
    .comment-block-text {
      position: relative;
      padding: 8px;
      border-radius: 8px;
      width: fit-content;
    }

    .creator-name {
      letter-spacing: 0.0025em;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 8px;
    }
    .comment-block-text-part {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.0025em;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 9; /* number of lines to show */
      line-clamp: 9;
      -webkit-box-orient: vertical;
      &.show-all {
        -webkit-line-clamp: 9999999; /* number of lines to show */
        line-clamp: 9999999;
      }
    }
    .comment-block-img {
      .v-image {
        border-radius: 8px;
      }
    }
    .comment-actions {
      display: flex;
      gap: 12px;
      margin: 4px 0;
      &__fk {
        opacity: 0.7;
        pointer-events: none;
      }
      .like-cmt,
      .rep-cmt,
      .time-cmt {
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.0025em;
      }
      .edit-desc {
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.0025em;
      }
      .like-cmt,
      .rep-cmt {
        font-weight: 600;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .block-img {
    object-fit: contain;
    max-width: 480px;
    max-height: 224px;
    border-radius: 8px;
    object-position: "top left";
    width: auto;
    height: auto;
  }
}
.still-unsolve-report.child {
  .comment-block-text {
    border: 1px solid;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      ),
      #d11313 !important;
  }
}
.buzzle.child {
  .comment-block-text {
    animation: buzzle 1s ease 6;
  }
}
@keyframes buzzle {
  0% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(4px) scaleX(1.1);
  }
  50% {
    transform: translateY(0) scaleX(1) scaleY(1.1);
  }
  70% {
    transform: translateY(4px) scaleX(1) scaleY(1);
  }
  100% {
    transform: translateY(0px) scaleX(1) scaleY(1);
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
.total-like-cmt {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.0025em;
  display: flex;
  align-items: center;
  gap: 2px;
}
.expand-text-btn {
  font-size: 13px;
}
</style>
