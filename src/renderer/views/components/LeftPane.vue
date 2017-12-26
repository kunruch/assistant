<template>
  <div id="left-pane">
    <div class="pane-header">
      <div class="pane-title">
        {{ title }}
      </div>
      <slot name="below-title"></slot>
    </div>
    <ul class="bare pane-menu">
      <li v-for="menu in model" :key="menu.name">
        <router-link :to="menu.to">
          <img :src="icons[menu.icon]"> {{ menu.name }}
         </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import icons from '../../icons'
  export default {
    name: 'left-pane',
    props: {
      title: String,
      model: Array
    },
    data () {
      return {
        icons: icons
      }
    }
  }
</script>

<style lang="scss">
.pane-title {
  font-size: 2rem;
  line-height: 8rem;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
}

.pane-menu {
  margin-top: 0;
  border-top: 1px solid #DAE1E7;

  li {
    margin: 0;
  }

  li a {
    display: block;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    line-height: 4rem;
    font-weight: 400;
    padding: 0 12px;
    background: #fafafa;
    color: #777;
    border-bottom: 1px solid #DAE1E7;
    text-decoration: none;
    margin: 0;
    cursor: pointer;

    &.router-link-active, &:hover {
      background: white;
      color: #333;
    }

    &.router-link-active {
      margin-right: -1px;
    }

    img {
      float: left;
      height: 1.8rem;
      margin: 14px 8px;
    }
  }
}
</style>