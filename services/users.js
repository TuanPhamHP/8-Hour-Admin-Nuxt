const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL
const repo = (axios) => {
  return {
    getListContacts(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/contacts`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListUsers(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/users`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getDetailUser(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/users/${id}`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListCompanies(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/companies`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListDepartments(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/departments`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListPositions(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/positions`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    create(payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/admin/users`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    update(id, payload) {
      return axios
        .put(`${VUE_APP_BASE_URL}/api/admin/users/${id}`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    resetPassword(id, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/users/${id}/reset-password`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
  }
}
export default repo
