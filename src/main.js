import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'


import App from './App.vue'
import Logon from './Logon.vue'
import Help from './Help.vue'

import Main from './Main'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: Main },
		{ path: '/logon', component: Logon },
		{ path: '/help', component: Help },
	]
});






const app = createApp(App);

app.use(router);


app.mount('.app');
