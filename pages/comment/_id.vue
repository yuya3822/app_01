<template>
  <div class="flex">
    <div class="left">
      <SideNavi />
    </div>
    <div class="right">
      <div class="title">
        <p>コメント</p>
      </div>
      <Message :posts="posts" :uid="uid" />
      <div class="comment">
        <div class="comment-title">
          <p>コメント</p>
        </div>
        <div class="message" v-for="comment in comments" :key="comment.id">
          <div class="flex">
            <p class="name">{{ comment.user_name }}</p>
          </div>
          <div>
            <p class="text">{{ comment.comment }}</p>
          </div>
        </div>
        <input v-model="content" type="text" />
        <button @click="postComment">コメント</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      posts: [],
      comments: [],
      uid: null,
      content: null,
    };
  },
  methods: {
    async getPostAndCommentData() {
      const { data } = await this.$axios.get(
        "https://vast-citadel-16110.herokuapp.com/api/v1/comment/",
        {
          params: {
            post_id: this.$route.params.id,
          },
        }
      );
      const post = data.data;
      return post;
    },
    async getLikeCount(post) {
      const { data } = await this.$axios.get(
        "https://vast-citadel-16110.herokuapp.com/api/v1/like/count",
        {
          params: {
            post_id: post.id,
          },
        }
      );
      post.like_count = data.count;
      return post;
    },
    async getHasLike(post) {
      const { data } = await this.$axios.get(
        "https://vast-citadel-16110.herokuapp.com/api/v1/like",
        {
          params: {
            post_id: post.id,
            user_id: this.uid,
          },
        }
      );
      post.has_like = data.result;
      this.comments = post.comments;
      this.posts.push(post);
    },
    getData() {
      firebase.auth().onAuthStateChanged(async (user) => {
        this.uid = user.uid;
        let post = await this.getPostAndCommentData();
        post = await this.getLikeCount(post);
        await this.getHasLike(post);
      });
    },
    async postComment() {
      const { data } = await this.$axios.post(
        "https://vast-citadel-16110.herokuapp.com/api/v1/comment",
        {
          post_id: this.posts[0].id,
          user_id: this.uid,
          comment: this.content,
        }
      );
      this.comments.push(data.data);
      this.content = "";
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
.comment-title {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid white;
  border-left: 1px solid white;
}
.comment input {
  width: 95%;
  height: 30px;
  margin-top: 20px;
  margin-bottom: 15px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid white;
  background-color: #15202b;
  color: white;
}
.message {
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid white;
  border-left: 1px solid white;
}
.text {
  margin-top: 10px;
  font-size: 10px;
}
button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  color: #fff;
  background-color: #5419da;
  border-radius: 25px;
  display: block;
  margin: 0 0 0 auto;
  cursor: pointer;
}
</style>