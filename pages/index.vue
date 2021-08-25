<template>
  <div class="flex">
    <div class="left">
      <SideNavi @getPost="getData" />
    </div>
    <div class="right">
      <div class="title">
        <p>ホーム</p>
      </div>
      <Message :posts="posts" :uid="uid" />
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  middleware: "auth",
  data() {
    return {
      posts: [],
      uid: null,
    };
  },
  methods: {
    async getPostData() {
      const { data } = await this.$axios.get(
        "https://vast-citadel-16110.herokuapp.com/api/v1/post"
      );
      const posts = data.data;
      return posts;
    },
    async getLikeCount(posts) {
      for (let i = 0; i < posts.length; i++) {
        const { data } = await this.$axios.get(
          "https://vast-citadel-16110.herokuapp.com/api/v1/like/count",
          {
            params: {
              post_id: posts[i].id,
            },
          }
        );
        posts[i].like_count = data.count;
      }
      return posts;
    },
    async getHasLike(posts) {
      for (let i = 0; i < posts.length; i++) {
        const { data } = await this.$axios.get(
          "https://vast-citadel-16110.herokuapp.com/api/v1/like",
          {
            params: {
              post_id: posts[i].id,
              user_id: this.uid,
            },
          }
        );
        posts[i].has_like = data.result;
      }
      this.posts = posts;
    },
    getData() {
      firebase.auth().onAuthStateChanged(async (user) => {
        this.uid = user.uid;
        let posts = await this.getPostData();
        posts = await this.getLikeCount(posts);
        await this.getHasLike(posts);
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>
.left {
  width: 22%;
  height: 100vh;
}
.right {
  width: 78%;
  height: 100vh;
}
.flex {
  display: flex;
}
.title {
  border-bottom: 1px solid white;
  border-left: 1px solid white;
  padding: 15px;
}
.title p {
  font-size: 20px;
  font-weight: bold;
}
</style>