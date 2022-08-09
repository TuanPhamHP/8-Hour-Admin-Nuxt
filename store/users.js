import api from '@/services';
const users = {
  state: () => ({
    listUsers: [],
    listContacts: [],
    listUserGroup: [],
    companies: [],
    departments: [],
    positions: [],
    applications: [],
    usersStatus: [
      {
        id: 1,
        name: 'Đang hoạt động'
      },
      {
        id: 2,
        name: 'Ngừng hoạt động'
      }
    ]
  }),
  mutations: {
    'users/setListUsers'(state, payload) {
      state.listUsers = [...payload];
    },
    'users/setListUserGroup'(state, payload) {
      state.listUserGroup = [...payload];
    },
    'users/setListCompanies'(state, payload) {
      state.companies = [...payload];
    },
    'users/setListDepartments'(state, payload) {
      state.departments = [...payload];
    },
    'users/setListPositions'(state, payload) {
      state.positions = [...payload];
    },
    'users/setListApplication'(state, payload) {
      state.applications = [...payload];
    }
  },
  actions: {
    async getListUsers({ commit }) {
      const res = await api.users.getListUsers({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getUsersFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListUsers', res.data.data.users);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    },
    async getListUserGroup({ commit }) {
      const res = await api.userGroup.getListUserGroup({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getUserGroupFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListUserGroup', res.data.data.user_groups);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    },
    async getListCompanies({ commit }) {
      const res = await api.users.getListCompanies({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getCompaniesFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListCompanies', res.data.data.companies);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    },
    async getListDepartments({ commit }) {
      const res = await api.users.getListDepartments({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getDepartmentsFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListDepartments', res.data.data.departments);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    },
    async getListPositions({ commit }) {
      const res = await api.users.getListPositions({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getPositionsFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListPositions', res.data.data.positions);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    },
    async getListApplications({ commit }) {
      const res = await api.applications.getListData({ pagination: false });
      if (!res) {
        commit('toast/getError', this.sysLanguage.snackbar.getApplicationsFail);
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          commit('toast/getError', res.data.message);
          return;
        }
        commit('users/setListApplication', res.data.data.applications);
      } catch (error) {
        commit('toast/getError', `${error}`);
      }
    }
  }
};
export default users;
