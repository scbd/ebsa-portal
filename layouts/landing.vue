<template>
    <LazyIconSymbols v-once/>
    <LazyPageHeader/>
      <div class="full-screen-video-container">
        <video autoplay loop muted>
          <source src="/EBSA-LOGO-loop-HQ.mp4" type="video/mp4" />
        </video>
        <div class="full-screen-video-content">
          <slot/>
        </div>
      </div>
</template>

<style lang="scss" scoped>
.full-screen-video-container {
    position: relative;
    height: 95vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.full-screen-video-container video {
    z-index: -1;
    position: absolute;
    width: auto;
    height: auto;
    min-width: 100%;
    min-height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.full-screen-video-content {
    width: 100%;
    height: 100%;
    // background-color: white;
    // color: #333;
    // padding: 20px;
    // font-size: 70px;
    // margin-top: 100px;
}
</style>