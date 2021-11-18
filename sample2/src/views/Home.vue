<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" class="py-2">
        <v-btn v-on:click="loadFile" outlined>
          <v-icon>mdi-folder-open-outline</v-icon>
        </v-btn>
        <v-btn v-on:click="saveFile" outlined>
          <v-icon>mdi-content-save-edit</v-icon>
        </v-btn>
        <v-btn v-on:click="compile" outlined>
          <v-icon>mdi-play-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div style="height: 200px">
      <editor
        editor-id="editorA"
        :content="contentA"
        v-on:change-content="changeContentA"
        @parentMethod="handEditor"
      >
      </editor>
    </div>
    <div class="loginForm">
      <v-row>
        <v-col cols="12" sm="4" md="2">
          <v-text-field label="Room" solo v-model="roomName"> </v-text-field>
        </v-col>
        <v-btn style="margin-top: 19px" v-on:click="login">log in</v-btn>
      </v-row>
    </div>
    <div class="InputField">
      <v-row>
        <v-col cols="6" md="6">
          <v-textarea
            solo
            name="inputData"
            background-color="white"
          ></v-textarea>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Editor from '../components/Editor'
export default {
    components:{
        Editor
    }
};
</script>

<style scoped>
</style>