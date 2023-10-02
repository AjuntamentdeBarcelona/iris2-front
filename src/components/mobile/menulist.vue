<template>
  <div class="menu-mobile">
    <input
      type="text"
      class="menu-search"
      placeholder="Cerca una temàtica">
    <!-- Show class to the button changes the arrow direction and adds the bold  -->
    <ul class="menu">
      <li
        v-for="n in 7"
        :key="n"
        class="menu-item">
        <button class="list-item">
          <span class="list-item__name">
            Menu item level 1
          </span>
          <font-awesome-icon
            icon="chevron-right"
            class="list-item__icon ml-auto"/>
        </button>
      </li>

      <li class="menu-item">
        <button class="list-item show">
          <span class="list-item__name">
            Menu item level 1
          </span>
          <font-awesome-icon
            icon="chevron-right"
            class="list-item__icon ml-auto"/>
        </button>
        <ul class="menu">
          <li
            v-for="n in 7"
            :key="n"
            class="menu-item">
            <button class="list-item">
              <span class="list-item__name">
                Menu item level 2
              </span>
              <font-awesome-icon
                icon="chevron-right"
                class="list-item__icon ml-auto"/>
            </button>
          </li>
          <li class="menu-item">
            <button class="list-item show">
              <span class="list-item__name">
                Menu item level 2
              </span>
              <font-awesome-icon
                icon="chevron-right"
                class="list-item__icon ml-auto"/>
            </button>
            <ul class="menu">
              <li
                v-for="n in 7"
                :key="n"
                class="menu-item">
                <button class="list-item">
                  <span class="list-item__name">
                    Menu item level 3
                  </span>
                  <font-awesome-icon
                    icon="chevron-right"
                    class="list-item__icon ml-auto"/>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </li>

    </ul>
  </div>
</template>

<script>
export default {
  name: 'MobileMenuList',
  data() {
    return {
      active: 6,
    }
  },
}
</script>


<style lang="scss">
.menu-search {
  width: 100%;
  background-color: rgba($light, 0.5);
  border: none;
  padding: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
  outline: inherit !important;
}
.menu {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 1rem;
}
.list-item {
  border: none;
  width: 100%;
  display: flex;
  outline: inherit !important;
  cursor: pointer;
  &__icon {
    transition: 0.3s ease;
    transform: rotate(90deg);
  }
  &.show {
    font-weight: bolder;
    .list-item__icon {
      transform: rotate(0deg);
    }
  }
}
</style>
