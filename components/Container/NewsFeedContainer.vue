<template>
  <div class="news-container m-0 px-3 py-4 content-slot-container">
    <div class="content-slot-header">
      Bản tin
      <v-btn
        color="primary"
        depressed
        style="border-radius: 8px"
        @click="showAddNews = true"
      >
        Tạo bản tin
      </v-btn>
    </div>
    <div
      class="content-slot-content mx-auto w-100 white box-shadow--mod-lighter"
    >
      <v-row class="m-0 align-end filter-wr">
        <v-col cols="3">
          <div class="each-filter">
            <p class="mb-1 filter-name neutral--text">Tìm kiếm</p>
            <div class="filter-input">
              <input
                v-model="contactSearchQuery"
                type="text"
                :placeholder="sysLanguage.placeholder.textSearch"
                class="input-no-focus font-size-14"
              />
              <v-icon color="neutral" size="20">mdi-magnify</v-icon>
            </div>
          </div></v-col
        >
        <v-col cols="3">
          <div class="each-filter w-100">
            <p class="mb-1 filter-name neutral--text">Ngày</p>
            <div class="page-filter-date-range w-100">
              <DatePicker
                :singleDatePicker="false"
                :show-ranges="true"
                :picked-date="pickedDate"
                :placeholder-picker="'Ngày'"
                :format-default-date="'dmy'"
                :default-date="
                  fromDate && toDate
                    ? {
                        startDate: fromDate,
                        endDate: toDate,
                      }
                    : {}
                "
                :picker-class="'page-filter-date-range'"
              />
            </div></div
        ></v-col>
        <v-col cols="4" class="ml-auto">
          <div class="panigate-block px-2">
            <Pagination
              :loading="loadingSearch"
              class="mt-0"
              :pagination-sync="pagination"
              @handlePageSizeChange="pagePaginationChange"
              @handlePageChange="pagePaginationChange"
            /></div
        ></v-col>
      </v-row>

      <!-- <div class="table-wrapper white">
        <NewsTable
          :list-data="listDataComputed"
          :isFirstLoading="isFirstLoading"
          :loadingTable="loadingSearch"
          :revokeData="revokeData"
          :selectDataToUpdate="selectDataToUpdate"
          :viewDetail="viewDetail"
          :tableStartIndex="tableStartIndex"
          :isSearch="isSearch"
        />
      </div> -->
      <vue-custom-scrollbar class="scroll-area table-wrapper" v-dragscroll>
        <NewsTable
          :list-data="listDataComputed"
          :isFirstLoading="isFirstLoading"
          :loadingTable="loadingSearch"
          :revokeData="revokeData"
          :selectDataToUpdate="selectDataToUpdate"
          :viewDetail="viewDetail"
          :tableStartIndex="tableStartIndex"
          :isSearch="isSearch"
        />
      </vue-custom-scrollbar>
    </div>
    <DialogConfirm
      :isVisible="showConfirmRevokeNews"
      :cancelAction="cancelRevoke"
      :confirmAction="confirmRevoke"
      :cancelBtnText="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancelBtnColor="'neutral_color_sub4'"
      :confirmBtnText="sysLanguage.confirmDialog.confirmBtnTextNormal"
      :title="sysLanguage.confirmDialog.revokeNewsTitle"
      :message="sysLanguage.confirmDialog.revokeNewsMsg"
      :loadingConfirmBtn="loadingRevoke"
    />
    <DialogAddNews
      :isVisible="showAddNews"
      :cancelAction="cancelAddNews"
      :confirmAction="addNews"
      :showPreviewNews="showPreviewNews"
    />
    <DialogUpdateNews
      :data="selectedDataToUpdate"
      :isVisible="showUpdateNews"
      :cancelAction="cancelUpdateNews"
      :confirmAction="addNews"
      :showPreviewNews="showPreviewNews"
    />
    <DialogPreviewNews
      :data="selectedDataToPreview"
      :isVisible="previewNews"
      :cancelAction="cancelPreviewNews"
      :confirmAction="addNews"
    />
  </div>
</template>

<script>
import api from "@/services"
import NewsTable from "../Table/NewsTable.vue"
import Pagination from "@/components/Layout/Pagination.vue"
import DialogConfirm from "@/components/Dialog/DialogConfirm.vue"
import DatePicker from "@/components/DatePicker.vue"
import { mapState } from "vuex"
import DialogAddNews from "../Dialog/DialogAddNews.vue"
import DialogUpdateNews from "../Dialog/DialogUpdateNews.vue"
import DialogPreviewNews from "../Dialog/DialogPreviewNews.vue"
import vueCustomScrollbar from "vue-custom-scrollbar"
import "vue-custom-scrollbar/dist/vueScrollbar.css"
export default {
  components: {
    NewsTable,
    Pagination,
    DatePicker,
    DialogConfirm,
    DialogAddNews,
    DialogUpdateNews,
    DialogPreviewNews,
    vueCustomScrollbar,
  },
  data() {
    return {
      showUpdateNews: false,
      showAddNews: false,
      previewNews: false,
      showConfirmRevokeNews: false,
      selectedDataToRevoke: {},
      selectedDataToUpdate: {},
      selectedDataToPreview: {},
      listData: [],
      loadingRevoke: false,
      loadingSearch: false,
      isFirstLoading: true,
      forcedLoading: false,
      refIntersect: 0,
      contactSearchQuery: "",
      firstSync: true,
      fromDate: "",
      toDate: "",
      pagination: {
        total: 1,
        total_pages: 1,
        per_page: 15,
        page: 1,
      },
    }
  },
  computed: {
    ...mapState({
      listNews: (state) => state.news.listNews,
      prvScroll: (state) => state.news.prvScroll,
    }),
    showSkeletonPost() {
      return !this.isFirstLoading
    },
    isSearch() {
      const query = { ...this.$route.query }
      delete query.size
      delete query.page

      return !!Object.keys(query).length
    },
    currentQuery() {
      if (this.routeName === "news-search") {
        return this.$route.query.q
      }
      return ""
    },
    listDataComputed() {
      if (this.routeName === "news-search") {
        return this.listData
      } else {
        return !this.isFirstLoading ? this.listData : this.listNews
      }
    },
    tableStartIndex() {
      return (this.pagination.page - 1) * this.pagination.per_page
    },
  },
  created() {
    if (this.listNews && this.listNews.length) {
      this.isFirstLoading = false
      this.initSize = Math.max(this.listNews.length, 4)
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.getListData()
      },
    },
    pagination: {
      deep: true,
      handler() {
        this.syncUrl()
      },
    },
    contactSearchQuery() {
      if (this.firstSync) {
        return
      }
      clearTimeout(this.refIntersect)
      this.refIntersect = setTimeout(() => {
        this.pagination = {
          ...this.pagination,
          page: 1,
        }
        // this.syncUrl()
      }, 700)
    },
  },
  mounted() {
    this.bindUrl()
    this.getListData()
  },
  methods: {
    showPreviewNews(_news) {
      this.previewNews = true
      this.selectedDataToPreview = _news
    },
    cancelPreviewNews() {
      this.previewNews = false
      this.selectedDataToPreview = {}
    },
    async selectDataToUpdate(_data) {
      const payload = {}
      const id = _data.id

      this.loadingDetail = true
      const res = await api.annoucement.getDetailData(id, payload)

      this.loadingDetail = false
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
        this.selectedDataToUpdate = dataObj.announcement
        this.showUpdateNews = true
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    viewDetail(id) {
      this.$router.push(`/news/${id}`)
    },
    addNews() {
      this.getListData()
    },
    cancelAddNews() {
      this.showAddNews = false
    },
    cancelUpdateNews() {
      this.selectedDataToUpdate = {}
      this.showUpdateNews = false
    },
    revokeData(_data) {
      console.log(_data)
      this.showConfirmRevokeNews = true
      this.selectedDataToRevoke = { ..._data }
    },
    cancelRevoke() {
      this.showConfirmRevokeNews = false
      this.selectedDataToRevoke = {}
    },
    pagePaginationChange(_val) {
      this.pagination = {
        ...this.pagination,
        per_page: _val.per_page,
        page: _val.page,
      }
    },
    removeDataLocal(_data) {
      const index = this.listData.findIndex((o) => o.id === _data.id)
      if (index !== -1) {
        this.listData.splice(index, 1)
      }
    },
    updateDataLocal(_data) {
      const index = this.listData.findIndex((o) => o.id === _data.id)
      if (index !== -1) {
        this.listData.splice(index, 1, _data)
      }
    },
    async confirmRevoke() {
      this.loadingRevoke = true
      const res = await api.annoucement.revoke(this.selectedDataToRevoke.id)
      this.loadingRevoke = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.revokeNewsFail,
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
          this.sysLanguage.snackbar.revokeNewsSuccess,
        )
        this.updateDataLocal(res.data.data.announcement)
        this.cancelRevoke()
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    syncUrl() {
      const query = {
        size: this.pagination.per_page,
        page: this.pagination.page,
      }
      if (this.contactSearchQuery) {
        query.search = this.contactSearchQuery
      }
      if (this.fromDate) {
        query.created_at_from = this.fromDate
      }
      if (this.toDate) {
        query.created_at_to = this.toDate
      }
      this.$router.replace({ path: "/", query }).catch(() => {})
    },
    bindUrl() {
      const query = this.$route.query
      if (query.search) {
        this.contactSearchQuery = query.search
      }
      if (+query.size) {
        this.pagination = { ...this.pagination, per_page: +query.size }
      }
      if (+query.page) {
        this.pagination = { ...this.pagination, page: +query.page }
      }
      if (query.created_at_from) {
        this.fromDate = query.created_at_from
      }
      if (query.created_at_to) {
        this.toDate = query.created_at_to
      }
    },
    pickedDate(_val) {
      console.log(_val)
      if (!_val || !_val.value || !_val.value.startDate) {
        this.fromDate = ""
        this.toDate = ""
        this.syncUrl()
        return
      }
      this.fromDate = _val.value.startDate
      this.toDate = _val.value.endDate
      this.syncUrl()
    },
    async getListData(isSearch = false) {
      this.loadingSearch = true
      const query = { ...this.$route.query }
      const payload = { ...query }
      const res = await api.annoucement.getListData(payload)
      this.isFirstLoading = false
      this.loadingSearch = false
      this.firstSync = false
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
        this.listData = dataObj.announcements
        if (!this.isSearch) {
          this.$store.commit("setListNews", dataObj.announcements)
        }
        this.pagination = {
          total: dataObj.meta.pagination.total,
          total_pages: dataObj.meta.pagination.total_pages,
          per_page: dataObj.meta.pagination.per_page,
          page: dataObj.meta.pagination.current_page,
        }
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
      setTimeout(() => {
        if (isSearch) {
          setTimeout(() => {
            const query = this.$route.query.q
            const listTitle = document.querySelectorAll(".news-header")
            listTitle.forEach((o) => {
              const innerHTML = o.innerText
              o.innerHTML = this.highlightMatchText(query, innerHTML)
            })
          }, 10)
        } else {
          setTimeout(() => {
            const listTitle = document.querySelectorAll(".news-header")
            listTitle.forEach((o) => {
              o.innerHTML = o.innerText
            })
          }, 10)
        }
        this.isFirstLoading = false
      }, 10)
    },
    resolveSubmitLocal(_post) {
      const index = this.listData.findIndex((o) => o.id === _post.id)
      if (index !== -1) {
        this.listData.splice(index, 1, _post)
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
.content-slot-container {
  height: calc(100vh - 58px);
  align-items: unset;
}
.content-slot-header {
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-slot-content {
  height: calc(100% - 44px);
  border-radius: 8px;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.news-container {
  .filter-wr {
    height: 100px;
  }
  .table-wrapper {
    position: relative;
    height: calc(100% - 100px);
    padding-bottom: 70px;
    overflow-x: scroll;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #e6e6e600;
      border-radius: 0px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 0px;
      background: rgba(176, 176, 176, 0.526);
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        border-radius: 0px;
        background: rgb(96, 96, 96);
      }
    }
  }
}
</style>
