<template>
  <div class="news-comments-group">
    <div
      v-for="comment in listCommentsComputed"
      :key="comment.id"
      class="each-news-comment"
      :id="`news-comment-id-${comment.id}`"
      :class="[comment.unsolveReport ? 'still-unsolve-report' : '']"
    >
      <div class="cmt-p">
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
                :ref="`pre-cmt-ref-${comment.id}`"
                style="line-height: 20px"
                class="comment-block-text-part font-weight-regular neutral--text"
                :class="showAllIds.includes(comment.id) ? 'show-all' : ''"
                >{{ comment.content }}</pre
              >
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
              class="mb-0 total-like-cmt ml-auto pointer neutral_color_sub2--text box-shadow--mod-lighter app_bg"
              :class="comment.file ? 'cmt-img-tl' : ''"
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
      <div class="list-child">
        <p
          v-if="!showChild.includes(comment.id) && comment.total_children"
          class="child-count neutral--text"
          @click="onShowChild(comment.id)"
        >
          <v-icon color="neutral" size="15"
            >mdi-subdirectory-arrow-right</v-icon
          >
          {{ comment.total_children }} Câu trả lời
        </p>
        <ChildComment
          v-if="showChild.includes(comment.id)"
          :parentId="comment.id"
          :postId="postId"
          :fLoadTotal="comment.total_children"
          :commentRepFromParent="commentRep"
          :reportComment="reportComment"
        />
      </div>
    </div>
    <div v-if="loadingComment" class="mx-auto" style="width: fit-content">
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
import ChildComment from "./ChildComment.vue"
import handleFiles from "@/mixins/handleFiles"
import api from "@/services"
import { mapGetters } from "vuex"
export default {
  components: { RegularAvatarVue, ChildComment },
  mixins: [handleFiles],
  props: {
    loadingComment: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: Number,
      default: -1,
    },
    totalComments: {
      type: Number,
      default: 1,
    },
    listComments: {
      type: Array,
      default() {
        return []
      },
    },
    loadMoreCmts: {
      type: Function,
      default() {},
    },
    syncReport: {
      type: Function,
      default() {},
    },
    resolveEditLocal: {
      type: Function,
      default() {},
    },
    reportComment: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      selectedCmt: {},
      selectedCmtToRemove: {},
      commentRep: {},
      loadingRemove: false,
      showChild: [],
      showAllIds: [],
      isColapseText: true,
      refLoading: 0,
    }
  },
  computed: {
    ...mapGetters({
      userFromAuth: "userFromAuth",
    }),
    listCommentsComputed() {
      return this.listComments.map((o) => ({
        ...o,
        unsolveReport: this.countUnsolveReport(o),
        over9: this.getCmtLineCount(o),
        listChildComments: [...this.listComments],
      }))
    },
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.syncScroll()
      },
    },
  },
  mounted() {
    this.syncScroll()
  },
  methods: {
    countUnsolveReport(cmt) {
      if (!cmt.reports || !cmt.reports.length) {
        return 0
      }
      return cmt.reports.filter((o) => o.status && o.status.id === 1).length
    },
    syncScroll() {
      if (this.loadingComment) {
        clearTimeout(this.refLoading)
        this.refLoading = setTimeout(() => {
          this.syncScroll()
        }, 300)

        return
      }
      // comment rendered
      setTimeout(() => {
        const hash = this.$route.hash
        if (!hash) {
          return
        }
        const target = document.querySelector(
          `#news-comment-id-${String(hash).replace("#", "")}`,
        )
        if (!target) {
          return
        }
        document
          .querySelectorAll(".buzzle")
          .forEach((o) => o.classList.remove("buzzle"))

        setTimeout(() => {
          target.classList.add("buzzle")
        }, 10)
        const ost = target.offsetTop
        document.querySelector(".p-maker").scrollTo(0, ost - 120)
      }, 100)
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
    toggleColapseText() {
      if (!this.textOver9) {
        return
      }
      this.isColapseText = !this.isColapseText
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
    getPostLineCount(comment) {
      setTimeout(() => {
        const el = this.$refs[`pre-cmt-ref-${comment.id}`][0]
        if (!el) {
          return
        }
        const divHeight = el.offsetHeight
        const lineHeight = parseInt(el.style.lineHeight)

        const lines = divHeight / lineHeight
        comment.over9 = lines > 9
      }, 10)
    },

    onShowChild(_id) {
      const set = new Set([...this.showChild, _id])

      this.showChild = [...set]
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
        this.loadMoreCmts(false)
        this.syncReport(res.data.data.report)
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
    .cmt-p {
      display: flex;
      gap: 8px;
    }
  }
  .list-child {
    padding-left: 50px;
    .child-count {
      font-weight: 600;
      font-size: 12px;
      margin: 0px 0 8px;
      cursor: pointer;
      display: flex;
      align-items: baseline;
      &:hover {
        text-decoration: underline;
      }
    }
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
.total-like-cmt {
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.0025em;
  display: flex;
  align-items: center;
  gap: 2px;
}
.expand-text-btn {
  font-size: 13px;
}
.still-unsolve-report {
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
.still-unsolve-report.buzzle {
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
</style>
<style lang="scss">
.total-like-cmt {
  padding: 1px 3px;
  border-radius: 12px;

  position: absolute;
  bottom: -1px;
  right: 0;
  transform: translateX(100%);
}
</style>
