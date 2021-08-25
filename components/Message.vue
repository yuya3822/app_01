<template>
  <div>
    <div v-for="(post, index) in posts" :key="post.id">
      <div class="message">
        <div class="flex">
          <p class="name">{{ post.user_name }}</p>
          <img
            class="icon"
            src="../assets/heart.png"
            @click="like(post, index)"
          />
          <p class="number">
            {{ post.like_count }}
          </p>
          <img
            class="icon"
            src="../assets/cross.png"
            @click="deletePost(post.id, index)"
          />
          <img
            class="icon detail"
            src="../assets/detail.png"
            @click="
              $router.push({
                path: '/comment/' + post.id,
                params: { id: post.id },
              })
            "
            v-if="$route.name === 'index'"
          />
        </div>
        <p class="text">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: Array,
    uid: String,
  },
  methods: {
    async like(post, index) {
      const sendData = {
        post_id: post.id,
        user_id: this.uid,
      };
      if (!post.has_like) {
        const { data } = await this.$axios.post(
          "https://vast-citadel-16110.herokuapp.com/api/v1/like",
          sendData
        );
        this.posts[index].like_count = data.count;
        this.posts[index].has_like = data.result;
      } else {
        const { data } = await this.$axios.delete(
          "https://vast-citadel-16110.herokuapp.com/api/v1/like",
          {
            data: sendData,
          }
        );
        this.posts[index].like_count = data.count;
        this.posts[index].has_like = data.result;
      }
    },
    async deletePost(id, index) {
      await this.$axios.delete("https://vast-citadel-16110.herokuapp.com/api/v1/post/" + id);
      this.posts.splice(index, 1);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}
.icon {
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.detail {
  margin-left: 50px;
}
.message {
  padding: 20px;
  border-bottom: solid 1px white;
  border-left: solid 1px white;
}
.name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}
.text {
  margin-top: 10px;
}
.number {
  margin-left: 10px;
  margin-right: 10px;
}
</style>