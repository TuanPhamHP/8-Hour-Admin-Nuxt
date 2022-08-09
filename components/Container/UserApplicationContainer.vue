<template>
  <div class="user-group-container m-0 px-3 py-4 content-slot-container">
    <div class="content-slot-header">Phân quyền truy cập hệ thống</div>
    <div
      class="content-slot-content mx-auto w-100 white box-shadow--mod-lighter"
    >
      <v-row class="m-0 align-end filter-wr no-wrap">
        <v-col style="max-width: 400px" cols="3">
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
        <UserApplicationTable
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
        <UserApplicationTable
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
      :isVisible="showConfirmRemove"
      :cancelAction="cancelRemove"
      :confirmAction="confirmRemove"
      :cancelBtnText="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancelBtnColor="'neutral_color_sub4'"
      :confirmBtnText="sysLanguage.confirmDialog.confirmBtnTextNormal"
      :title="sysLanguage.confirmDialog.removeGroupTitle"
      :rawHtml="true"
      :message="removeMsgComputed"
      :loadingConfirmBtn="loadingRemove"
    />
    <DialogCreateUserGroup
      :isVisible="showCreateUserGroup"
      :cancelAction="cancelCreateUser"
      :confirmAction="addUserGroup"
    />
    <DialogUpdateApplicationUsers
      :data="selectedDataToUpdate"
      :isVisible="showUpdateGroup"
      :cancelAction="cancelUpdateGroups"
      :confirmAction="updateUserGroup"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vueCustomScrollbar from 'vue-custom-scrollbar';
import DialogCreateUserGroup from '../Dialog/DialogCreateUserGroup.vue';
import DialogUpdateApplicationUsers from '../Dialog/DialogUpdateApplicationUsers.vue';
import UserApplicationTable from '../Table/UserApplicationTable.vue';
import Pagination from '@/components/Layout/Pagination.vue';
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue';
import 'vue-custom-scrollbar/dist/vueScrollbar.css';
import api from '@/services';
export default {
  components: {
    UserApplicationTable,
    Pagination,
    DialogConfirm,
    DialogCreateUserGroup,
    DialogUpdateApplicationUsers,
    vueCustomScrollbar
  },

  data() {
    return {
      showListUser: false,
      showUpdateGroup: false,
      showCreateUserGroup: false,
      showConfirmRemove: false,
      selectedDataToRemove: {},
      selectedDataToUpdate: {},
      listData: [],
      loadingRemove: false,
      loadingSearch: false,
      isFirstLoading: true,
      forcedLoading: false,
      refIntersect: 0,
      selectRef: 0,
      contactSearchQuery: '',
      firstSync: true,
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
    tableStartIndex() {
      return (this.pagination.page - 1) * this.pagination.per_page;
    },
    isSearch() {
      const query = { ...this.$route.query };
      delete query.size;
      delete query.page;

      return !!Object.keys(query).length;
    },
    removeMsgComputed() {
      return `Bạn có chắc chắn muốn xóa nhóm <b>${
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
    async selectDataToUpdate(_data) {
      const payload = { pagination: false };
      const id = _data.id;

      this.loadingDetail = true;
      const res = await api.applications.getDetailData(id, payload);

      this.loadingDetail = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getDetailUserGroupFail
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
        this.selectedDataToUpdate = {
          ..._data,
          users: dataObj.users
        };
        this.showUpdateGroup = true;
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    viewDetail(id) {
      const path = this.$route.path;
      this.$router.push(`/${String(path).replace('/', '')}/${id}`);
    },
    addUserGroup() {
      this.getListData();
      this.cancelCreateUser();
    },
    updateUserGroup() {
      this.getListData();
      this.cancelUpdateGroups();
    },
    cancelCreateUser() {
      this.showCreateUserGroup = false;
    },
    cancelUpdateGroups() {
      this.selectedDataToUpdate = {};
      this.showUpdateGroup = false;
    },
    revokeData(_data) {
      this.showConfirmRemove = true;
      this.selectedDataToRemove = { ..._data };
    },
    cancelRemove() {
      this.showConfirmRemove = false;
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
    async confirmRemove() {
      this.loadingRemove = true;
      const res = await api.userGroup.delete(this.selectedDataToRemove.id);
      this.loadingRemove = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.removeGroupFail
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
          this.sysLanguage.snackbar.removeGroupSuccess
        );
        this.getListData();
        this.cancelRemove();
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
    },

    async getListData() {
      this.loadingSearch = true;
      const query = { ...this.$route.query };
      const payload = { ...query };
      const res = await api.applications.getListData(payload);
      this.isFirstLoading = false;
      this.loadingSearch = false;
      this.firstSync = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getApplicationsFail
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
        this.listData = dataObj.applications;

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
.user-group-container {
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
