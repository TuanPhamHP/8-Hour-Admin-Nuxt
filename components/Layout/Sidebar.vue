<template>
  <v-card class="no-box-shadow white h-100">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      class="bg-transparent w-100 pt-3"
    >
      <v-list dense class="sidebar_tab_navigator pt-0">
        <v-list-item
          v-for="item in itemsComputed"
          :key="item.title"
          link
          class="each-tab-in-navigator"
          :class="[
            item.pathNameMatch.includes(currentPathActive)
              ? item.isGroup
                ? 'sidebar_ico_active_color--text'
                : 'primary sidebar_ico_active_color--text'
              : 'neutral--text sidebar_ico_active_color',
            item.isGroup ? 'has-child' : ''
          ]"
        >
          <!-- "" -->
          <router-link
            v-if="!item.isGroup"
            :to="item.path"
            class="v-list-item px-0"
          >
            <v-list-item-icon>
              <v-icon
                :color="
                  item.pathNameMatch.includes(currentPathActive)
                    ? 'sidebar_ico_active_color'
                    : 'secondary_text'
                "
                >{{ item.icon }}</v-icon
              >
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="navigator-title">
                <span
                  :class="
                    item.pathNameMatch.includes(currentPathActive)
                      ? 'sidebar_ico_active_color--text'
                      : 'neutral--text'
                  "
                >
                  <!-- "" -->
                  {{ sysLanguage.sidebar[item.title] }}</span
                >
              </v-list-item-title>
            </v-list-item-content>
          </router-link>
          <div v-if="item.isGroup" class="w-100">
            <v-expansion-panels
              v-model="item.panel"
              accordion
              class="v-list-item px-0 w-100"
            >
              <v-expansion-panel>
                <v-expansion-panel-header
                  expand-icon="mdi-menu-down"
                  :class="
                    item.pathNameMatch.includes(currentPathActive)
                      ? 'primary group-expand sidebar_ico_active_color--text'
                      : 'neutral--text sidebar_ico_active_color'
                  "
                >
                  <v-list-item-icon>
                    <v-icon
                      :color="
                        item.pathNameMatch.includes(currentPathActive)
                          ? 'sidebar_ico_active_color'
                          : 'secondary_text'
                      "
                      >{{ item.icon }}</v-icon
                    >
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title class="navigator-title">
                      <span
                        :class="
                          item.pathNameMatch.includes(currentPathActive)
                            ? 'sidebar_ico_active_color--text'
                            : 'neutral--text'
                        "
                      >
                        <!-- "" -->
                        {{ sysLanguage.sidebar[item.title] }}</span
                      >
                    </v-list-item-title>
                  </v-list-item-content>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list-item
                    v-for="c in item.listChild"
                    :key="c.title"
                    link
                    class="each-tab-in-navigator my-0"
                    style="min-height: 32px"
                    :class="
                      item.pathNameMatch.includes(currentPathActive)
                        ? 'white sidebar_ico_active_color--text'
                        : 'neutral--text sidebar_ico_active_color'
                    "
                  >
                    <!-- "" -->
                    <router-link
                      v-if="!c.isGroup"
                      :to="c.path"
                      class="v-list-item px-0 my-0"
                    >
                      <v-list-item-icon v-if="c.icon">
                        <v-icon
                          :color="
                            c.pathNameMatch.includes(currentPathActive)
                              ? 'sidebar_ico_active_color'
                              : 'secondary_text'
                          "
                          >{{ c.icon }}</v-icon
                        >
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title class="navigator-title pl-4">
                          <span
                            :class="
                              c.pathNameMatch.includes(currentPathActive)
                                ? 'primary--text font-weight-bold'
                                : 'neutral--text'
                            "
                          >
                            <!-- "" -->
                            {{ sysLanguage.sidebar[c.title] }}</span
                          >
                        </v-list-item-title>
                      </v-list-item-content>
                    </router-link>
                  </v-list-item>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'SideBar',
  data() {
    return {
      drawer: true,
      isMounted: false,
      pad: 0,
      items: [
        {
          title: 'news',
          icon: 'mdi-home-variant-outline',
          path: '/',
          pathNameMatch: ['index', 'news', 'news-search', 'news-detail']
        },
        {
          title: 'users',
          icon: 'mdi-contacts-outline',
          path: '/users',
          pathNameMatch: [],
          isGroup: true,
          panel: 0,
          listChild: [
            {
              title: 'users',
              icon: '',
              path: '/users',
              pathNameMatch: ['users', 'users-detail']
            },
            {
              title: 'userCompany',
              icon: '',
              path: '/user-company',
              pathNameMatch: ['user-company', 'user-company-detail']
            },
            {
              title: 'userDepartment',
              icon: '',
              path: '/user-department',
              pathNameMatch: ['user-department', 'user-department-detail']
            },
            {
              title: 'userPosition',
              icon: '',
              path: '/user-position',
              pathNameMatch: ['user-position', 'user-position-detail']
            },
            {
              title: 'userGroup',
              icon: '',
              path: '/user-group',
              pathNameMatch: ['user-group', 'user-group-detail']
            },
            {
              title: 'userApplication',
              icon: '',
              path: '/user-applications',
              pathNameMatch: ['user-applications', 'user-applications-detail']
            }
          ]
        }

        // {
        //   title: "schedules",
        //   icon: "mdi-calendar-weekend-outline",
        //   path: "/schedules",
        //   pathNameMatch: ["schedules"],
        // },
      ]
    };
  },

  computed: {
    ...mapState({
      mini: (state) => state.sideBarAppMini
    }),
    ...mapGetters({
      sysLanguage: 'sysLanguage'
    }),
    currentPathActive() {
      return this.$route.name;
    },
    itemsComputed() {
      return this.items.map((o) => {
        if (o.isGroup) {
          let match = [];
          o.listChild.forEach((c) => {
            match = [...match, ...c.pathNameMatch];
          });
          o.pathNameMatch = [...o.pathNameMatch, ...match];
          o.panel = o.pathNameMatch.includes(this.currentPathActive) ? 0 : -1;
        }
        return o;
      });
    }
  },
  mounted() {
    this.isMounted = true;
  }
};
</script>

<style lang="scss">
.v-navigation-drawer__border {
  display: none;
}
.sidebar_tab_navigator {
  * {
    text-decoration: none !important;
  }
  padding-left: 8px !important;
  padding-right: 8px !important;
}
.v-navigation-drawer--mini-variant {
  min-width: 64px !important;
}
.each-tab-in-navigator {
  min-height: 48px !important;
  margin-bottom: 12px !important;
  overflow: hidden;
  border-radius: 8px;
  &.has-child {
    padding-left: 0;
    padding-right: 0;
  }
  .v-list-item__icon {
    margin-top: auto !important;
    margin-bottom: auto !important;
    margin-right: 20px !important;
  }
  .v-expansion-panel::before,
  .v-expansion-panel::after,
  .v-list-item--link::before,
  .v-list-item--link::after,
  .v-list-item::before,
  .v-list-item::after,
  .v-expansion-panel-header::before,
  .v-ripple__container {
    display: none !important;
  }

  .v-expansion-panel-header {
    padding: 0 16px !important;
    border-radius: 8px;
  }
  .v-expansion-panel-content__wrap {
    padding-right: 0;
  }
  .v-expansion-panel-content {
    .each-tab-in-navigator {
      margin: 6px 0;
      border-radius: 8px;
    }
  }
  .v-expansion-panel-header > :not(.v-expansion-panel-header__icon) {
    flex: unset;
  }
  .v-expansion-panel--active > .v-expansion-panel-header {
    min-height: 48px;
  }
  .group-expand.primary {
    .v-expansion-panel-header__icon {
      i {
        color: #fff !important;
      }
    }
  }
}
.navigator-title {
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  }
}
.v-list-item::before,
.v-list-item::after {
  display: none !important;
}
</style>
