const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL
const dtRepo = (axios) => {
  return {
    getListData(payload) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getDetailData(id = 0, payload = {}) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getDataReport(id = 0, payload = {}) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}/reports`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListLikes(id = 0, payload = {}) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}/likes`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListRead(id = 0, payload = {}) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}/recipients`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListLikesCmt(aId = 0, cId = 0, payload = {}) {
      return axios
        .get(
          `${VUE_APP_BASE_URL}/api/staff/announcements/${aId}/comments/${cId}/likes`,
          {
            params: { ...payload },
          },
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListComments(id, payload = {}) {
      return axios
        .get(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}/comments`, {
          params: { ...payload },
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    getListCommentsL2(_newsId, _cmtId, payload = {}) {
      return axios
        .get(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${_newsId}/comments/${_cmtId}/children`,
          {
            params: { ...payload },
          },
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    revoke(id, payload = {}) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${id}/revoke`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    read(id, payload = {}) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}/read`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    createComment(id, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${id}/comments`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    updateComment(newsId, cmtId, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/comments/${cmtId}`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    reportComment(newsId, cmtId, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/comments/${cmtId}/report`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    likePost(newsId, payload = {}) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/like`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    unlikePost(newsId, payload = {}) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/unlike`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    likeComment(newsId, commentId, payload = {}) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/comments/${commentId}/like`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    unlikeComment(newsId, commentId, payload = {}) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/comments/${commentId}/unlike`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    deleteComment(newsId, commentId) {
      return axios
        .delete(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${newsId}/comments/${commentId}`,
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
        .post(`${VUE_APP_BASE_URL}/api/admin/announcements`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    update(id, payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/admin/announcements/${id}`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    handlerReport(anounncementId, reportId, payload) {
      return axios
        .post(
          `${VUE_APP_BASE_URL}/api/admin/announcements/${anounncementId}/reports/${reportId}/handle`,
          payload,
        )
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    // NTC

    resetPassword(id, payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/airports/${id}/reset-password`, payload)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
    delete(id) {
      return axios
        .delete(`${VUE_APP_BASE_URL}/api/airports/${id}`)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err.response
        })
    },
  }
}
export default dtRepo
