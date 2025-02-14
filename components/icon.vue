<template >
  <svg :class="{ [`ebsa-icon-${name}`]:true, 'ebsa-icon-flip': flip}" class="ebsa-icon" :style="iconStyle">
    <use  v-bind="{ 'xlink:href': `#ebsa-icon-${name}` }"></use>
  </svg>
</template>
<script setup>

const   props        = defineProps({  name : { type: String, required: true },
                                      flip : { type: Boolean, default: false } ,
                                      color: { type: String, default: '#247080' },
                                      size : { type: Number, default: 1 }
                                    });

const { name, flip, color, size } = toRefs(props);

const iconStyle = reactive({ 
                              'fill'  : color.value ,
                              'width' : `${size.value}em`,
                              'height': `${size.value}em`
                            });
</script>
<style scoped>
.ebsa-icon {
  display     : inline-block;
  width       : 1em;
  height      : 1em;
  stroke-width: 0;
  stroke      : currentColor;
  margin-bottom: .2em;
  /* fill        : currentColor; */
}
.ebsa-icon-flip{
  transform: scaleX(-1);
}
</style>