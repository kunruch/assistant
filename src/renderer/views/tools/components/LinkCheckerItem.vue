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


<style lang="scss" scoped>
ul {
  padding-left: 0;
  margin-left: 0;
  line-height: 1.25em;
}

li ul li {
  padding-left: 2.8rem;
}

li {  
  background: white;
  padding: 3px 6px 3px 0;
  margin: 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: 0;
  }
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
  margin-left: 0.5rem;
}

.bold {
  font-weight: bold;
}

.ok {
  color: #38C172;
}

.error {
  color: #E3342F;
}

.info {
  color: #F6993F;
}
</style>