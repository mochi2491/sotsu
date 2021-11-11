var app1 = new Vue({
    el: '#loginInput',
    data: {
        roomName: 'aaaa'
    },
    methods: {
        login: function () {
            ws.send(this.roomName)

        }
    }
})//login

var app2 = new Vue({
    el: '#editorWatcher',
    data: {

    },
    watch: {

    },
    methods: {
        shoot: function (aa) {
            alert(aa)
        }
    }
})

Vue.component('Editor', {
    template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
    props: ['editorId', 'content', 'lang', 'theme'],
    data() {
        return {
            editor: Object,
            beforeContent: ''
        }
    },
    watch: {
        'content'(value) {
            if (this.beforeContent !== value) {
                this.editor.setValue(value, 1)
            }
        }
    },
    mounted() {
        const lang = this.lang || 'text'
        const theme = this.theme || 'github'

        this.editor = window.ace.edit(this.editorId)
        this.editor.setValue(this.content, 1)

        this.editor.$blockScrolling = Infinity;
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        // mode-xxx.js or theme-xxx.jsがある場合のみ有効
        this.editor.getSession().setMode(`ace/mode/html`)
        this.editor.setTheme(`ace/theme/monokai`)

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue()
            this.$emit('change-content', this.editor.getValue())
        })
    },
    methods:{
        font(){
            this.editor.setFontSize($(e.target).data('size'));
        }
    }
})

const app = new Vue({
    el: "#app",
    data() {
        return {
            contentA: 'default content for Editor A',
            contentB: 'default content for Editor B'
        }
    },
    methods: {
        reset() {
            this.contentA = 'reset content for Editor A'
            this.contentB = 'reset content for Editor B'
        },
        changeContentA(val) {
            if (this.contentA !== val) {
                this.contentA = val
                ws.send(this.contentA)
            }
        },
        changeContentB(val) {
            if (this.contentB !== val) {
                this.contentB = val
            }
        }
    }
})