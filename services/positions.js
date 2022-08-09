const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL
const repo = (axios) => {
  return {
    getListData(payload) {
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
    getDetailData(id, payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/positions/${id}`, {
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
        .put(`${VUE_APP_BASE_URL}/api/admin/positions/${id}`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    create(payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/admin/positions`, payload)
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
        url: `${VUE_APP_BASE_URL}/api/admin/positions/${_id}`,
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
