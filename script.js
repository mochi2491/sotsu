Vue.component('Editor', {
    template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
    props: ['editorId', 'content', 'lang', 'theme'],
    data() {
        return {
            editor: Object,
            beforeContent: '',
            inputData: ''
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
    methods: {
        
    }
})

const app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data() {
        return {
            contentA: 'default content for Editor A',
            contentB: 'default content for Editor B',
            roomName: ''
        }
    },
    computed: {
        clock: function () {
            return new Date()
        },
        now: function () {
            return this.clock.getHours() + ":"
                + this.clock.getMinutes() + ":" +
                this.clock.getSeconds()
        },
        fusionString: function () {
            return this.contentA + ":" + this.now
        }
    },
    methods: {
        login: function () {
            ws.send(this.roomName)
            ws.send("START")
        },
        reset:function() {
            this.contentA = 'reset content for Editor A'
            this.contentB = 'reset content for Editor B'
        },
        changeContentA(val) {
            if (this.contentA !== val) {
                this.contentA = val
                ws.send(this.fusionString)
            }
        },
        changeContentB(val) {
            if (this.contentB !== val) {
                this.contentB = val
            }
        },
        waitConfirm() {
            ws.send("waitConfirm")
        }
    }
})

