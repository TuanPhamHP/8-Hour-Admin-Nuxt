<template>
  <v-autocomplete
    v-model="model"
    dense
    solo
    :hide-details="true"
    flat
    :multiple="multiple"
    :placeholder="placeholder"
    :items="options"
    :clearable="clearAble"
    :deletable-chips="deletableChips"
    :chips="chips"
    :readonly="readonly"
    item-text="name"
    item-value="id"
    class="no-box-shadow v-autocomplete-form__mod my-0"
    :class="customClass"
    @change="updatedData"
    @update:search-input="onSearchData"
  >
    <template
      v-if="selectAll && listItemsComputed && listItemsComputed.length"
      v-slot:prepend-item
    >
      <div class="text-right px-3 pointer" @click="toggleSelectAll">
        {{ isSelectAll ? "Bỏ chọn tất cả" : "Chọn tất cả" }}
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    customClass: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: null,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    chips: {
      type: Boolean,
      default: false,
    },
    deletableChips: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
    options: {
      // id and name
      type: Array,
      default() {
        return []
      },
    },
    onChange: {
      type: Function,
      default() {},
    },
    clearAble: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    defaultValue() {
      if (this.defaultValue) {
        this.ableToSync = false
        this.model = this.defaultValue
        this.$nextTick(() => {
          this.ableToSync = true
        })
      }
    },
  },
  mounted() {
    if (this.defaultValue) {
      this.ableToSync = false
      this.model = this.defaultValue
      this.$nextTick(() => {
        this.ableToSync = true
      })
    }
  },
  data() {
    return {
      ableToSync: true,
      model: null,
      search: "",
    }
  },
  computed: {
    listItemsComputed() {
      const ori = this.options.slice()
      const resultLeft = ori.filter((o) =>
        this.search
          ? String(o.name)
              .toLowerCase()
              .includes(String(this.search).toLowerCase())
          : true,
      )
      let arr = resultLeft.map((o) => o.id)
      return arr
    },
    isSelectAll() {
      return this.listItemsComputed.every((o) => this.model.includes(o))
    },
  },
  methods: {
    onSearchData(val) {
      this.search = val || ""
    },
    updatedData(_val) {
      this.onChange(_val)
    },
    toggleSelectAll() {
      if (this.isSelectAll) {
        this.model = this.model.filter(
          (o) => !this.listItemsComputed.includes(o),
        )
      } else {
        const s = new Set([...this.model, ...this.listItemsComputed])
        this.model = [...s]
      }
    },
  },
}
</script>

<style></style>
