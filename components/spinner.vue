<template>
    <div :class="{'modal-mask':isModal}" class="w-100 text-center   d-flex align-items-start">
        <div :class="{'modal-container':isModal}" >
            <NuxtImg src="/img/cbd-gbf-logo.jpeg" format="webp" class="rotate" :width="size" :height="size" />
            <p  v-if="message" class="fs-3">{{ message }}</p>
            <p v-if="!message" style="color:white;" class="fs-3">{{t('loading')}}...</p>
        </div>

        <slot>
        </slot>
    </div>
</template>
<script setup >
    const { t } = useI18n();
    const props = defineProps({
                                    message : { type: String },
                                    size    : { type: Number, default: 125 },
                                    isModal : { type: Boolean, default: false }
                                });

    
    const { message, size, isModal } = toRefs (props);
    
</script>

<style scoped>
.rotate {
    animation: rotation 3s infinite linear;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}
.modal-mask {
    position: absolute;
    z-index: 99998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    transition: opacity 0.3s ease;
    min-height: v-bind(size+80 + 'px');
    
}
.modal-container {
    min-height: v-bind(size + 'px');
    width: 100%;
    padding: 20px 30px;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    color: white;
}

</style>