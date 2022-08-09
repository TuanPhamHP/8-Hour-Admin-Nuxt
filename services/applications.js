const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL
const repo = (axios) => {
  return {
    getListData(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/applications`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getDetailData(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/applications/${id}/users`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    update(id, payload) {
      return axios
        .put(`${VUE_APP_BASE_URL}/api/admin/applications/${id}`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    syncApplications(id, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/users/${id}/sync-applications`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    syncApplicationUsers(id, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/applications/${id}/sync-users`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    create(payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/admin/applications`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    delete(_id) {
      return axios({
        method: "DELETE",
        url: `${VUE_APP_BASE_URL}/api/admin/applications/${_id}`,
      })
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
