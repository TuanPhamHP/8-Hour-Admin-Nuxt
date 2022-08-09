<template>
  <div class="news-container m-0 px-3 py-4 content-slot-container">
    <div class="content-slot-header">
      Danh sách Bộ phận
      <v-btn
        color="primary"
        depressed
        style="border-radius: 8px"
        class="low-letter-spacing"
        @click="showCreateDepartment = true"
      >
        Tạo mới bộ phận
      </v-btn>
    </div>
    <div
      class="content-slot-content mx-auto w-100 white box-shadow--mod-lighter"
    >
      <v-row class="m-0 align-end filter-wr no-wrap">
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
              <!-- <v-icon color="neutral" size="20">mdi-magnify</v-icon> -->
            </div>
          </div></v-col
        >
        <v-col style="max-width: 220px" cols="auto">
          <div class="each-filter w-100">
            <p class="mb-1 filter-name neutral--text">Công ty</p>
            <SelectAuto
              :placeholder="'Công ty'"
              :onChange="onChangeCompany"
              :default-value="+company_id"
              :options="companies"
            /></div
        ></v-col>
        <v-col cols="auto" class="ml-auto">
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
        <UserDepartmentTable
          :list-data="listDataComputed"
          :isFirstLoading="isFirstLoading"
          :loadingTable="loadingSearch"
          :revokeData="revokeData"
          :selectDataToUpdate="selectDataToUpdate"
          :viewDetail="viewDetail"
        />
      </div> -->
      <vue-custom-scrollbar class="scroll-area table-wrapper" v-dragscroll>
        <UserDepartmentTable
          :list-data="listDataComputed"
          :isFirstLoading="isFirstLoading"
          :loadingTable="loadingSearch"
          :revokeData="revokeData"
          :selectDataToUpdate="selectDataToUpdate"
          :viewDetail="viewDetail"
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
      :message="removeMsgComputed"
      :rawHtml="true"
      :loadingConfirmBtn="loadingRevoke"
    />
    <DialogCreateDepartment
      :isVisible="showCreateDepartment"
      :cancelAction="cancelCreateDepartment"
      :confirmAction="addUser"
    />
    <DialogUpdateNews
      :data="selectedDataToUpdate"
      :isVisible="showUpdateNews"
      :cancelAction="cancelUpdateNews"
      :confirmAction="addUser"
    />
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar';
import { mapState } from 'vuex';
import UserDepartmentTable from '../Table/UserDepartmentTable.vue';
import DialogCreateDepartment from '../Dialog/DialogCreateDepartment.vue';
import DialogUpdateNews from '../Dialog/DialogUpdateNews.vue';
import api from '@/services';
import SelectAuto from '@/components/Filter/SelectAuto.vue';
import 'vue-custom-scrollbar/dist/vueScrollbar.css';
import Pagination from '@/components/Layout/Pagination.vue';
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue';
export default {
  components: {
    UserDepartmentTable,
    Pagination,
    DialogConfirm,
    DialogCreateDepartment,
    DialogUpdateNews,
    SelectAuto,
    vueCustomScrollbar
  },

  data() {
    return {
      showUpdateNews: false,
      showCreateDepartment: false,
      showConfirmRevokeNews: false,
      selectedDataToRemove: {},
      selectedDataToUpdate: {},
      listData: [],
      loadingRevoke: false,
      loadingSearch: false,
      isFirstLoading: true,
      forcedLoading: false,
      refIntersect: 0,
      selectRef: 0,
      contactSearchQuery: '',
      firstSync: true,
      company_id: null,
      department_id: null,
      position_id: null,
      is_active: null,
      pagination: {
        total: 1,
        total_pages: 1,
        per_page: 15,
        page: 1
      }
    };
  },
  computed: {
    ...mapState({
      listNews: (state) => state.news.listNews,
      companies: (state) => state.users.companies,
      departments: (state) => state.users.departments,
      positions: (state) => state.users.positions,
      usersStatus: (state) => state.users.usersStatus
    }),
    removeMsgComputed() {
      return `Bạn có chắc chắn muốn xóa chức danh <b>${
        this.selectedDataToRemove && this.selectedDataToRemove.id
          ? this.selectedDataToRemove.name
          : ''
      }</b> không?`;
    },
    showSkeletonPost() {
      return !this.isFirstLoading;
    },
    currentQuery() {
      if (this.routeName === 'news-search') {
        return this.$route.query.q;
      }
      return '';
    },
    listDataComputed() {
      return this.listData;
    }
  },
  created() {
    if (this.listNews && this.listNews.length) {
      this.isFirstLoading = false;
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.getListData();
      }
    },
    pagination: {
      deep: true,
      handler() {
        this.syncUrl();
      }
    },
    contactSearchQuery() {
      if (this.firstSync) {
        return;
      }
      clearTimeout(this.refIntersect);
      this.refIntersect = setTimeout(() => {
        this.pagination = {
          ...this.pagination,
          page: 1
        };
        // this.syncUrl()
      }, 700);
    },
    selectRef() {
      if (this.firstSync) {
        return;
      }
      clearTimeout(this.refIntersect);
      this.refIntersect = setTimeout(() => {
        this.pagination = {
          ...this.pagination,
          page: 1
        };
      }, 700);
    }
  },
  mounted() {
    this.bindUrl();
    this.getListData();
  },
  methods: {
    onChangeCompany(_val) {
      this.selectRef += 1;
      this.company_id = _val;
    },
    onChangeDepartment(_val) {
      this.selectRef += 1;
      this.department_id = _val;
    },
    onChangePosition(_val) {
      this.selectRef += 1;
      this.position_id = _val;
    },
    onChangeStatus(_val) {
      this.selectRef += 1;
      this.is_active = _val;
    },
    async selectDataToUpdate(_data) {
      const payload = {};
      const id = _data.id;

      this.loadingDetail = true;
      const res = await api.departments.getDetailData(id, payload);

      this.loadingDetail = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getNewsFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          console.log(res);
          return;
        }
        const dataObj = res.data.data;
        this.selectedDataToUpdate = dataObj.announcement;
        this.showUpdateNews = true;
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    viewDetail(id) {
      const path = this.$route.path;
      this.$router.push(`/${String(path).replace('/', '')}/${id}`);
    },
    addUser() {
      this.getListData();
    },
    cancelCreateDepartment() {
      this.showCreateDepartment = false;
    },
    cancelUpdateNews() {
      this.selectedDataToUpdate = {};
      this.showUpdateNews = false;
    },
    revokeData(_data) {
      this.showConfirmRevokeNews = true;
      this.selectedDataToRemove = { ..._data };
    },
    cancelRevoke() {
      this.showConfirmRevokeNews = false;
      this.selectedDataToRemove = {};
    },
    pagePaginationChange(_val) {
      this.pagination = {
        ...this.pagination,
        per_page: _val.per_page,
        page: _val.page
      };
    },
    removeDataLocal(_data) {
      const index = this.listData.findIndex((o) => o.id === _data.id);
      if (index !== -1) {
        this.listData.splice(index, 1);
      }
    },
    updateDataLocal(_data) {
      const index = this.listData.findIndex((o) => o.id === _data.id);
      if (index !== -1) {
        this.listData.splice(index, 1, _data);
      }
    },
    async confirmRevoke() {
      this.loadingRevoke = true;
      const res = await api.positions.delete(this.selectedDataToRemove.id);
      this.loadingRevoke = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.removePositionFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          return;
        }
        this.$store.commit(
          'toast/getSuccess',
          this.sysLanguage.snackbar.removePositionSuccess
        );

        this.getListData();
        this.cancelRevoke();
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    syncUrl() {
      const query = {
        size: this.pagination.per_page,
        page: this.pagination.page
      };
      if (this.contactSearchQuery) {
        query.search = this.contactSearchQuery;
      }
      if (this.company_id) {
        query.company_id = this.company_id;
      }
      if (this.department_id) {
        query.department_id = this.department_id;
      }
      if (this.position_id) {
        query.position_id = this.position_id;
      }
      if (this.is_active) {
        query.is_active = this.is_active;
      }

      const path = this.$route.path;
      this.$router.replace({ path, query }).catch(() => {});
    },
    bindUrl() {
      const query = this.$route.query;
      if (query.search) {
        this.contactSearchQuery = query.search;
      }
      if (+query.size) {
        this.pagination = { ...this.pagination, per_page: +query.size };
      }
      if (+query.page) {
        this.pagination = { ...this.pagination, page: +query.page };
      }
      if (query.company_id) {
        this.company_id = query.company_id;
      }
      if (query.department_id) {
        this.department_id = query.department_id;
      }
      if (query.position_id) {
        this.position_id = query.position_id;
      }
      if (query.is_active) {
        this.is_active = query.is_active;
      }
    },
    pickedDate(_val) {
      console.log(_val);
      if (!_val || !_val.value || !_val.value.startDate) {
        this.fromDate = '';
        this.toDate = '';
        this.syncUrl();
        return;
      }
      this.fromDate = _val.value.startDate;
      this.toDate = _val.value.endDate;
      this.syncUrl();
    },
    async getListData() {
      this.loadingSearch = true;
      const query = { ...this.$route.query };
      const payload = { ...query };
      const res = await api.departments.getListData(payload);
      this.isFirstLoading = false;
      this.loadingSearch = false;
      this.firstSync = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getCompaniesFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          console.log(res);
          return;
        }
        const dataObj = res.data.data;
        this.listData = dataObj.departments;

        this.pagination = {
          total: dataObj.meta.pagination.total,
          total_pages: dataObj.meta.pagination.total_pages,
          per_page: dataObj.meta.pagination.per_page,
          page: dataObj.meta.pagination.current_page
        };
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    resolveSubmitLocal(_post) {
      const index = this.listData.findIndex((o) => o.id === _post.id);
      if (index !== -1) {
        this.listData.splice(index, 1, _post);
      }
    }
  }
};
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
