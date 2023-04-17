<script lang="ts">
export default {
  props: {
    digit: {
      type: String
    },
    onClick: {
      type: Function
    }
  },
  methods: {
    click(event: MouseEvent) {
      event.preventDefault()
      if (this.$props.onClick) {
        this.$props.onClick(this.$props.digit)
      }
    }
  }
}
</script>
<template>
  <button type="button" value="{{ digit }}" class="btn btn-secondary digit" @click="click">
    {{ digit }}
  </button>
</template>
<style scoped>
.digit {
  height: 40px;
  width: 50px;
  font-size: 1.1rem;
}
</style>
