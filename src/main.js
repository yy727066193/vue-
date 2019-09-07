// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { ListRouterView, ListRouterPage, AsyncForm, SearchForm, PopoverItem } from './components'
import PageBread from './views/common/PageBread'

Vue.config.productionTip = false;

Vue.prototype.$ELEMENT = { size: 'small' };
Vue.component(ListRouterView.name, ListRouterView);
Vue.component(ListRouterPage.name, ListRouterPage);
Vue.component(PageBread.name, PageBread);
Vue.component(AsyncForm.name, AsyncForm);
Vue.component(SearchForm.name, SearchForm);
Vue.component(PopoverItem.name, PopoverItem);

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

export default vm;
