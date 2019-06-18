<template>
  <div class="{{name}}">
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name:"{{name}}"
})
export default class {{name[0].toUpperCase() + name.slice(1)}} extends Vue {
  @Prop(type)private propName = propValue;
}
</script>
<style lang='scss' scoped >

</style>