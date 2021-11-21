<template>
  <div ref="ace" class="ace"></div>
</template>

<script>
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
// 使いたい言語モードのインポート
import "ace-builds/src-noconflict/mode-javascript";
// 使いたいテーマのインポート
import "ace-builds/src-noconflict/theme-github";
export default {
  name: "Ace",
  props: ["editorId", "content"],
  data() {
    return {
      editor: Object,
      beforeContent: "",
    };
  },
  mounted() {
    this.editor = ace.edit(this.$refs.ace);
    this.editor.session.setMode("ace/mode/javascript");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.on("change", () => {
      this.beforeContent = this.editor.getValue();
      this.$emit("change-content", this.editor.getValue());
    });
  },
  watch: {
    'content'(value){
      if(this.beforeContent!==value){
        this.editor.setValue(value, 1)
      }
    }
  },
};
</script>

<style scoped>
.ace {
  position: relative !important;
  border: 1px solid lightgray;
  margin: auto;
  height: 100%;
  width: 100%;
}
</style>