<template>
  <v-app data-app>
    <div
      id="app"
      class="app-container p-maker"
      :class="routeName === 'Login' ? 'primary login-app' : 'app_bg'"
      @scroll="refScroll"
    >
      <Header v-if="isAuth" />
      <v-container fluid class="py-0">
        <v-row class="main-board my-0 no-wrap">
          <v-col cols="2" v-if="isAuth" class="p-0 v-app__sidebar">
            <Sidebar />
          </v-col>
          <v-col
            :cols="!isAuth ? '12' : '10'"
            class="pt-0 pb-0 v-app__router-view"
          >
            <router-view />
          </v-col>
          <!-- <v-col cols="3" v-if="isAuth" class="pt-0 v-app__sidebar pb-3">
            <RightBarSticky />
          </v-col> -->
        </v-row>
      </v-container>
    </div>
    <Logout />
    <ListUserReadOnly />
    <FullPageView :on-show="showFullPage" />
    <div class="list-toastMsg">
      <p
        v-for="tm in toastMsg"
        :key="tm.uuid"
        class="toastMsg"
        :class="`toast-msg__${tm.type} snack_${tm.type}`"
      >
        <img
          v-if="tm.type === 'success'"
          height="32px"
          src="@/assets/images/toast-success.svg"
          alt="toast-success"
          class="toast-img-success"
        />
        <img
          v-if="tm.type === 'info'"
          height="32px"
          src="@/assets/images/toast-info.svg"
          alt="toast-info"
          class="toast-img-info"
        />
        <img
          v-if="tm.type === 'warning'"
          height="32px"
          src="@/assets/images/toast-warning.svg"
          alt="toast-warning"
          class="toast-img-warning"
        />
        <img
          v-if="tm.type === 'error'"
          height="32px"
          src="@/assets/images/toast-error.svg"
          alt="toast-error"
          class="toast-img-error"
        />

        {{ tm.msg }}
      </p>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import Sidebar from '@/components/Layout/Sidebar.vue';
import FullPageView from '@/components/FullPageView.vue';
import Header from '@/components/Layout/Header';
import Logout from '@/components/Dialog/Logout';
import ListUserReadOnly from '@/components/Dialog/ListUserReadOnly';
// import RightBarSticky from "./components/Layout/RightBarSticky.vue"
export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Logout,
    ListUserReadOnly,
    Sidebar,
    // RightBarSticky,
    FullPageView
  },
  sockets: {
    connect() {
      console.log('socket connected');
    }
  },
  data() {
    return {
      refContainerScroll: 1
    };
  },
  computed: {
    ...mapState({
      toastMsg: (state) => state.toast.messages,
      listImagePreview: (state) => state.listImagePreview
    }),
    showFullPage() {
      return !!(this.listImagePreview && this.listImagePreview.length);
    },
    ...mapGetters({
      isAuth: 'isAuth'
    })
  },
  watch: {
    isAuth() {
      if (this.isAuth) {
        this.toggleLogin();
      }
    },
    toastMsg: {
      deep: true,
      handler() {
        setTimeout(() => {
          this.toastMsg.forEach((o) => {
            this.$store.commit('toast/remove', o);
          });
        }, 4000);
      }
    }
  },
  mounted() {
    this.handleTheme();
    this.syncFavicon();
    if (window) {
      window.addEventListener('online', () => {
        this.$store.commit('toast/getSuccess', 'Back to online');
      });
      window.addEventListener('offline', () => {
        this.$store.commit(
          'toast/getError',
          'Your internet connection is offline now'
        );
      });
    }
    if (this.isAuth) {
      this.toggleLogin();
    }
    // const token =
    //   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc2VjdXJlLWRldi52YW5ncGhhaXNpbmgudm5cL2FwaVwvYXV0aFwvY3VzdG9tZXJzXC9sb2dpbiIsImlhdCI6MTY0ODExMzMxMSwiZXhwIjoxNjUzMjk3MzExLCJuYmYiOjE2NDgxMTMzMTEsImp0aSI6IlI0SlFSUDJ0OU16Wk5lbUwiLCJzdWIiOjE5LCJwcnYiOiIwNzVhZWZjNjdlMWUxYjhjMzdiZDUyZWJkNjE4NWNjODQ4NDQzM2EyIn0.wcQcl3cSoO2-yjN0qhulxX2E4bN-TmftaX-0cMmwwqE"
    // const channel = this.$socket.emit("subscribe", {
    //   channel: `private-customer-${19}`,
    //   auth: {
    //     headers: {
    //       Authorization: token,
    //     },
    //   },
    // })

    // this.$socket.emit("subscribe", {
    //   channel: `price-standard-gold-live`,
    // })
    // // Thay đổi giá vàng standard
    // this.sockets.subscribe("App\\Events\\PriceStandardGoldEvent", (data) => {
    //   console.log(data)
    // })
  },
  methods: {
    handleTheme() {
      if (process.env.VUE_APP_CURRENT_THEME === 'TRUSTANA') {
        this.$vuetify.theme.themes.light = {
          ...this.$vuetify.theme.defaults.trust_ana
        };
      } else {
        this.$vuetify.theme.light = true;
      }
    },
    syncFavicon() {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = process.env.VUE_APP_FAVICON
        ? process.env.VUE_APP_FAVICON
        : '';
    },
    handleSyncTheme() {
      const iconURL1 = 'https://vn.tradingview.com/static/images/favicon.ico';
      return iconURL1;
    },
    toggleLogin() {
      this.$store.dispatch('users/getListContacts');
      this.$store.dispatch('users/getListUsers');
      this.$store.dispatch('users/getListCompanies');
      this.$store.dispatch('users/getListDepartments');
      this.$store.dispatch('users/getListPositions');
      this.$store.dispatch('users/getListUserGroup');
      this.$store.dispatch('users/getListApplications');
      this.$store.dispatch('news/getListSticker');
    },
    refScroll(e) {
      clearTimeout(this.refContainerScroll);
      this.refContainerScroll = setTimeout(() => {
        if (
          ['news', 'index'].includes(this.routeName) &&
          !this.$route.query.q
        ) {
          this.$store.commit('news/setPrvScroll', e.target.scrollTop);
        }
      }, 100);
    }
  }
};
</script>
<style></style>
<style lang="scss"></style>
