<template>
  <li>
    <div>
      <span class="bold toggle" v-if="isFolder" @click="toggle">[{{open ? '-' : '+'}}]</span>
      <span class="bold" :class="model.displayType"><a href="#" @click="openExternalLink(model.url)">{{model.title}}</a> {{model.status}}</span>
      <span v-if="children.length > 0">{{children.length}} links checked</span>
      <span class="error" v-if="broken > 0">{{broken}} broken links</span>
    </div>
    <ul class="bare" v-show="open" v-if="isFolder">
      <link-checker-item class="item" v-for="model in model.children" :model="model" :key="model.title"></link-checker-item>
      <li class="item" v-for="link in children" :key="link.title">        
        <span :class="link.displayType"><a href="#" @click="openExternalLink(link.url)">{{link.title}}</a> - {{link.status}}</span>
      </li>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'link-checker-item',
    props: {
      model: Object
    },
    data: function () {
      return {
        open: false,
        broken: 0,
        children: []
      }
    },
    computed: {
      isFolder: function () {
        return this.children &&
          this.children.length
      }
    },
    created () {
    },
    methods: {
      addChild (child) {
        this.children.push(child)
        if (child.displayType === 'error') this.broken++
      },
      openExternalLink (link) {
        this.$electron.shell.openExternal(link)
      },
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      }
    }
  }
</script>


<style scoped>
ul {
  padding-left: 1.8rem;
  line-height: 1.25em;
}

li span {
  margin-right: 6px;
}

a {
  color: inherit;
}

.toggle {
  cursor: pointer;
  width: 20px;
  float:left;
}

.bold {
  font-weight: bold;
}

.ok {
  color: green;
}

.error {
  color: red;
}

.info {
  color: orange;
}
</style>