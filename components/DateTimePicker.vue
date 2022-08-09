<template>
  <DatePicker
    v-model="dateTime"
    type="datetime"
    format="DD-MM-YYYY hh:mm"
    value-type="timestamp"
    :placeholder="placeholder"
    :disabledDate="notBeforeToday"
    :confirm="true"
    @change="onChange(dateTime)"
  ></DatePicker>
</template>

<script>
import DatePicker from "vue2-datepicker"
import "vue2-datepicker/index.css"
export default {
  props: {
    placeholder: {
      type: String,
      default: "Ngày giờ",
    },
    onChange: {
      type: Function,
      default() {},
    },
    defaultDate: {
      type: null,
      default: 0,
    },
  },
  components: { DatePicker },
  mounted() {
    if (this.defaultDate) {
      this.dateTime = this.defaultDate
    }
  },
  data() {
    return {
      dateTime: null,
    }
  },
  methods: {
    notBeforeToday(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0))
    },
    // notBeforeCurrentHour(date) {
    //   return date.getHours() < new Date().getHours()
    // },
  },
}
</script>

<style></style>
