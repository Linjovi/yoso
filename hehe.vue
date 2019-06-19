<template>
  <div class="hehe">
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name:"hehe"
})
export default class Hehe extends Vue {
  @Prop(type)private propName = propValue;
}
</script>
<style lang='scss' scoped >

</style>