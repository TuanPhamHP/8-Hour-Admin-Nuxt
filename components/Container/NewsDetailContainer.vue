<template>
  <v-row class="m-0 p-0 pt-1 news-feed-row align-start no-wrap">
    <v-col cols="auto" class="side-detail">
      <div class="top-detail-card white box-shadow--mod-lighter">
        <div class="stt">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                class="mb-2"
                color="neutral"
                @click="fallBack"
              >
                <v-icon> mdi-arrow-left </v-icon>
              </v-btn>
            </template>
            <span>Quay lại</span>
          </v-tooltip>
        </div>
        <div class="dtt">
          <p class="each-dtt-content">
            <span class="detail-title bigone black--text">
              Bài đăng số {{ detailNewsComputed.id }}</span
            >
            <span
              class="detail-status"
              :class="parseNewsStatusTextClass(detailNewsComputed.status_id)"
            >
              <span
                class="small-dot"
                :class="parseNewsStatusClass(detailNewsComputed.status_id)"
              ></span>
              {{ parseNewsStatus(detailNewsComputed.status_id) }}</span
            >
          </p>
          <p class="each-dtt-content">
            <span class="detail-title smallone neutral_color_sub1--text">
              Người tạo:</span
            >
            <span class="detail-status smallone black--text">
              {{
                detailNewsComputed.creator
                  ? detailNewsComputed.creator.name
                  : ""
              }}</span
            >
          </p>
          <p class="each-dtt-content">
            <span class="detail-title smallone neutral_color_sub1--text">
              Ngày tạo:</span
            >
            <span class="detail-status smallone black--text">
              {{
                detailNewsComputed.created_at
                  ? formatDateDMYH(detailNewsComputed.created_at)
                  : ""
              }}</span
            >
          </p>
          <p class="each-dtt-content">
            <span class="detail-title smallone neutral_color_sub1--text">
              Ngày đăng:</span
            >
            <span class="detail-status smallone black--text">
              {{
                detailNewsComputed.published_at
                  ? formatDateDMYH(detailNewsComputed.published_at)
                  : ""
              }}</span
            >
          </p>
          <p
            class="statistical neutral--text neutral_color_sub5 pointer mb-2"
            @click="getListRead"
          >
            <v-icon color="neutral" size="18px">mdi-eye</v-icon>
            <span>{{ detailNewsComputed.total_read }} Người xem</span>
          </p>
          <p
            class="statistical neutral--text neutral_color_sub5 mb-2 pointer"
            @click="showListReaction"
          >
            <v-icon color="neutral" size="18px">mdi-thumb-up</v-icon>
            <span>{{ detailNewsComputed.total_like }} Lượt thích</span>
          </p>
          <p class="statistical neutral--text neutral_color_sub5 mb-2">
            <v-icon color="neutral" size="18px">mdi-message</v-icon>
            <span>{{ detailNewsComputed.total_comment }} Bình luận</span>
          </p>
        </div>
      </div>
      <div class="btm-reports-card white box-shadow--mod-lighter mt-3">
        <p class="reports-header neutral_color_sub2--text white mb-0">
          <v-icon color="neutral_color_sub3">mdi-alert-octagon-outline</v-icon>
          Danh sách bình luận bị báo cáo
        </p>

        <div class="list-reports">
          <div
            v-if="!listReportsData || !listReportsData.length"
            class="d-flex flex-column align-center py-5"
          >
            <img
              src="@/assets/images/no-user-filter.svg"
              alt="no-user-filter"
              style="max-width: 90%"
            />
            <p
              class="no-user__text neutral_color_sub2--text mt-2"
              style="font-size: 14px"
            >
              Chưa có bình luận nào bị báo cáo
            </p>
          </div>
          <div
            v-for="data in listReportsDataComputed"
            :key="data.id"
            class="each-report w-100 neutral_color_sub4--text"
            @click="markComment(data)"
          >
            <div class="each-report-header neutral_color_sub4--text">
              <div class="d-flex align-center header-row">
                <div class="w-50 report-label neutral_color_sub2--text">
                  Trạng thái:
                </div>
                <div class="w-50 report-content-small">
                  <span
                    class="detail-status"
                    :class="parseNewsReportStatusTextClass(data.status_id)"
                  >
                    <span
                      class="small-dot"
                      :class="parseNewsReportStatusClass(data.status_id)"
                    ></span>
                    {{ parseNewsReportStatus(data.status_id) }}</span
                  >
                </div>
              </div>
              <div class="d-flex align-center header-row">
                <div class="w-50 report-label neutral_color_sub2--text">
                  Người báo cáo:
                </div>
                <div class="w-50 report-content-small">
                  <span class="detail-status neutral--text">
                    {{ data.creator ? data.creator.name : "-" }}
                  </span>
                </div>
              </div>
            </div>
            <div class="each-report-body neutral_color_sub4--text">
              <div class="d-flex align-center body-row flex-wrap">
                <div class="w-100 report-label neutral_color_sub2--text">
                  Lý do:
                </div>
                <div class="w-100 report-content-small">
                  <span class="detail-status neutral--text">
                    {{ data.reason ? data.reason : "-" }}
                  </span>
                </div>
              </div>
              <div class="d-flex align-center body-row flex-wrap">
                <div class="w-100 report-label neutral_color_sub2--text">
                  Nội dung bình luận bị báo cáo:
                </div>
                <div class="w-100 report-content-small">
                  <span class="detail-status neutral--text">
                    {{
                      data.comment
                        ? parseCommentTextIp(data.comment.content)
                        : ""
                    }}
                  </span>
                  <img
                    v-if="data.comment && data.comment.file"
                    :src="data.comment.file"
                    alt="comment-img"
                    class="report-cmt-file"
                  />
                </div>
              </div>
              <div
                v-if="data.status_id === 1"
                class="d-flex align-end group-btn-row flex-wrap neutral_color_sub4--text"
              >
                <v-btn
                  class="white--text ml-auto"
                  color="semantic_success"
                  depressed
                  style="border-radius: 8px"
                  :disabled="loadingDisapprove"
                  :loading="loadingApprove"
                  @click="handlerReport(data, 'disapprove')"
                >
                  <v-icon size="20" class="mr-2">mdi-shield-check</v-icon>
                  {{ sysLanguage.news.hold }}
                </v-btn>
                <v-btn
                  class="white--text"
                  color="semantic_error"
                  depressed
                  style="border-radius: 8px"
                  :disabled="loadingApprove"
                  :loading="loadingDisapprove"
                  @click="handlerReport(data, 'approve')"
                >
                  <v-icon size="20" class="mr-2">mdi-trash-can-outline</v-icon>
                  {{ sysLanguage.news.remove }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="auto" class="main-detail">
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
        <NewsLoader v-if="showSkeletonPost || forceHideNewsCard" />
        <div v-if="!showSkeletonPost && !forceHideNewsCard">
          <NewsCard
            :refComment="refComment"
            :sync-report="resolveReportLocal"
            :data="detailNewsComputed"
            :is-detail="true"
            :postLikeClick="postLikeClick"
          />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import NewsLoader from "@/components/Loader/NewsLoader"
import NewsCard from "@/components/News/NewsCard"
import comments from "@/mixins/comments"

import { formatDateDMYH } from "@/helpers/dateFormater.js"
import {
  parseNewsStatus,
  parseNewsStatusClass,
  parseNewsStatusTextClass,
  parseNewsReportStatus,
  parseNewsReportStatusClass,
  parseNewsReportStatusTextClass,
} from "@/helpers/FormatnParse.js"
import { mapState } from "vuex"
import api from "@/services"
export default {
  mixins: [comments],
  components: { NewsLoader, NewsCard },
  data() {
    return {
      listData: [],
      listReportsData: [],
      loadingSearch: false,
      forceHideNewsCard: false,
      isFirstLoading: true,
      detailData: {},
      refComment: 1,
      forcedLoading: false,
      loadingDisapprove: false,
      loadingApprove: false,
    }
  },
  computed: {
    ...mapState({
      detailNews: (state) => state.news.detailNews,
    }),
    listReportsDataComputed() {
      return this.listReportsData.map((o) => ({
        ...o,
        status_id: o.status ? o.status.id : 0,
      }))
    },
    showSkeletonPost() {
      return (
        this.isFirstLoading &&
        (!this.detailNewsComputed || !this.detailNewsComputed.id)
      )
    },
    currentQuery() {
      if (this.routeName === "news-search") {
        return this.$route.query.q
      }
      return ""
    },
    detailNewsComputed() {
      if (this.detailData && this.detailData.id) {
        return this.detailData
      }
      return this.detailNews
    },
  },
  watch: {
    $route(_newVal, _oldVal) {
      if (_newVal.params.id !== _oldVal.params.id) {
        this.isFirstLoading = true
        this.forceHideNewsCard = true
        this.getDetailData()
        this.getReports()
      }
    },
  },
  mounted() {
    this.getDetailData()
    this.getReports()
  },
  methods: {
    resolveReportLocal(report) {
      const index = this.listReportsData.findIndex((o) => o.id === report.id)
      if (index !== -1) {
        this.listReportsData.splice(index, 1, report)
      }
    },
    formatDateDMYH(_d) {
      return formatDateDMYH(_d)
    },
    parseNewsStatus(_d) {
      return parseNewsStatus(_d)
    },
    parseNewsStatusTextClass(_d) {
      return parseNewsStatusTextClass(_d)
    },
    parseNewsStatusClass(_d) {
      return parseNewsStatusClass(_d)
    },
    parseNewsReportStatus(_d) {
      return parseNewsReportStatus(_d)
    },
    parseNewsReportStatusClass(_d) {
      return parseNewsReportStatusClass(_d)
    },
    parseNewsReportStatusTextClass(_d) {
      return parseNewsReportStatusTextClass(_d)
    },
    fallBack() {
      this.$router.push("/")
      // this.$router.go(-1)
    },
    markComment(data) {
      const _id = data.comment.id
      const a = document.createElement("a")
      a.href = `#${_id}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    showListReaction() {
      if (!this.detailNewsComputed.total_like) {
        return
      }
      const id = this.$route.params.id
      this.getLikes(id)
    },
    async getLikes(_id) {
      const res = await api.annoucement.getListLikes(_id)
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
    async getListLikesCmt(_aId, _cId) {
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
    async getListRead() {
      if (!this.detailNewsComputed.total_read) {
        return
      }
      const id = this.$route.params.id
      const res = await api.annoucement.getListRead(id, { read: true })
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
        if (res.data.data.recipients && res.data.data.recipients.length) {
          const arr = res.data.data.recipients.slice()
          this.$store.commit(
            "SET_LISTUSER_READONLY_POPUPNAME",
            "Danh sách người đọc bản tin",
          )
          this.$store.commit("SET_LISTUSER_READONLY_POPUP", [...arr])
        }
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
        console.error(error)
      }
    },
    async postLikeClick(_post) {
      // _post.is_like = !_post.is_like
      let res
      if (!_post.is_like) {
        _post.total_like += 1
        res = await api.annoucement.likePost(_post.id)
      } else {
        _post.total_like -= 1
        res = await api.annoucement.unlikePost(_post.id)
      }

      if (!res) {
        return
      }
      try {
        if (res.status && res.status >= 400) {
          _post.is_like = !_post.is_like
          if (_post.is_liked) {
            _post.total_like -= 1
          } else {
            _post.total_like += 1
          }
          return
        }
        const obj = { ..._post }
        const rsData = res.data.data.announcement
        obj.is_like = rsData.is_like
        obj.total_likes = rsData.total_likes
        this.resolveSubmitLocal(obj)
        console.log(res)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },
    async getReports() {
      const payload = {}
      const id = this.$route.params.id
      const res = await api.annoucement.getDataReport(id, payload)

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

          return
        }
        const dataObj = res.data.data
        this.listReportsData = dataObj.reports
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getDetailData(isSearch = false) {
      const payload = {}
      const id = this.$route.params.id
      if (isSearch) {
        this.loadingSearch = true
      }
      const res = await api.annoucement.getDetailData(id, payload)
      this.isFirstLoading = false
      this.forceHideNewsCard = false

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
        this.detailData = dataObj.announcement
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async handlerReport(data, type) {
      if (this.loadingRemove) {
        return
      }
      const reportId = data.id
      console.log(data)
      if (type === "approve") {
        this.loadingApprove = true
      }
      if (type === "disapprove") {
        this.loadingDisapprove = true
      }
      const res = await api.annoucement.handlerReport(
        this.$route.params.id,
        reportId,
        {
          type,
        },
      )
      this.loadingApprove = false
      this.loadingDisapprove = false
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
        if (!data.comment.parent_id) {
          this.refComment += 1
        } else {
          this.$store.commit("setRefChildCommentReport", data.comment.parent_id)
        }
        this.resolveReportLocal(res.data.data.report)
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
.news-feed-row {
  align-items: flex-start;
  min-height: 80vh;
}
.fallback-header {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.0125em;
  text-transform: uppercase;
}
.side-detail {
  position: sticky;
  top: 60px;
  min-width: 420px;
  width: 420px;

  .top-detail-card {
    border-radius: 8px;
    min-height: 100px;
    display: flex;
    padding: 12px 16px;

    .stt {
      width: 50px;
    }
    .dtt {
      width: calc(100% - 50px);
      .each-dtt-content {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        &:nth-of-type(4) {
          margin-bottom: 12px;
        }
      }
      .detail-title {
        width: 100%;
        &.bigone {
          font-weight: 500;
          font-size: 18px;
          line-height: 32px;
        }
        &.smallone {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }
      }
      .detail-status {
        display: flex;
        align-items: center;
        gap: 7px;
        width: 150px;
        min-width: 150px;
        text-align: right;
        justify-content: flex-end;
        &.smallone {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
    .statistical {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-weight: 500;
      font-size: 14px;
      border-radius: 4px;
      width: fit-content;
    }
  }
  .small-dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 100%;
  }
  .btm-reports-card {
    border-radius: 8px;
    min-height: 100px;
    max-height: calc(100vh - 104px - 250px);
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #ffffff00;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgb(136, 136, 136);
    }
    .reports-header {
      padding: 8px;
      display: flex;
      align-items: center;
      font-size: 14px;
      gap: 2px;
      position: sticky;
      top: 0px;
      z-index: 2;
      box-shadow: rgba(0, 0, 0, 0.08) 1.95px 1.95px 2.6px;
    }
    .each-report {
      border-bottom: 1px solid;
      padding-bottom: 12px;
      &:hover {
        background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.95)
          ),
          #0569ff;
      }
      &-header {
        padding: 12px 16px 4px;
        border-bottom: 1px solid;
        .header-row {
          margin-bottom: 8px;
        }
      }
      &-body {
        padding: 12px 0 0;
        .body-row {
          margin-bottom: 8px;
          padding: 0 16px;
        }
        .report-cmt-file {
          max-width: 150px;
          max-height: 150px;
          object-fit: contain;
        }
      }
      .group-btn-row {
        gap: 10px;
        padding: 12px 12px 0;
        button {
          height: 30px;
          font-weight: 600;
          font-size: 13px;
          line-height: 15px;
          letter-spacing: 0.05em;
        }
      }
      .report-label {
        font-size: 14px;
      }
      .report-content-small {
        font-size: 14px;
      }
      .detail-status {
        display: flex;
        align-items: center;
        gap: 7px;

        &.smallone {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
.main-detail {
  width: calc(100% - 421px);
}
</style>
