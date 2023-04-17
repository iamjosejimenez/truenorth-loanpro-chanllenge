<script lang="ts">
export default {
  props: {
    sign: {
      type: String
    },
    onClick: {
      type: Function
    }
  },
  methods: {
    click() {
      if (this.$props.onClick) {
        this.$props.onClick(this.sign)
      }
    }
  }
}
</script>
<template>
  <button type="button" class="operator btn btn-info" value="{{ sign }}" @click="click">
    {{ sign }}
  </button>
</template>
<style>
.operator {
  height: 40px;
  width: 50px;
  font-size: 1.1rem;
}
</style>
