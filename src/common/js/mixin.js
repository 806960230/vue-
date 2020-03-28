import {mapGetters} from 'vuex'

export const playlistMixin={
    computed:{
       ...mapGetters([
         'playlist'
       ])
    },
    mounted(){//dom渲染完时触发
       this.handlePlaylist(this.playlist)
    },
    activated(){//keep-alive里面的组件被切换时触发
      this.handlePlaylist(this.playlist)
    },
    watch:{
      playlist(newVal){
        this.handlePlaylist(newVal)
      }
    },
    methods:{//如果组件自己没有这个方法，就提示自己建立个方法
      handlePlaylist(){
        throw new Error('component must implement handlePlaylist method')
      }
    }
}
