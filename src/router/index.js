import { createRouter, createWebHistory } from 'vue-router'

import Main from '@/pages/Main.vue'
import TrnscListContainer from '@/pages/TrnscListContainer.vue'
import NewItem from '@/pages/NewItem.vue'
import Profile from '@/pages/Profile.vue'
import NotFound from '@/pages/NotFound.vue'


const router = createRouter({
    history: createWebHistory(),
    routes : [
        { path: '/', component: Main },
        { path: '/trnsc/edit/:id', component: NewItem, props: true },
        { path : '/trnsc/add', component : NewItem},
        { path : '/profile', component : Profile},
        { path : '/trnsc', component : TrnscListContainer},
        { path : '/trnsc/:trnscId', component : NewItem},
        { path : '/:path(.*)*', component : NotFound},
    ]
})

export default router;