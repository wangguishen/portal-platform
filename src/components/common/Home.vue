<template>
    <div class="wrapper">
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in">
            <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vSidebar
        },
        methods: {
                
        },
    }
</script>
