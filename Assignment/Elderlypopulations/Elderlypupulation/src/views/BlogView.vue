<template>
  <v-container>
    <!-- 客户评论表 -->
    <h2>Customer Reviews</h2>
    <v-text-field
      v-model="reviewSearch"
      label="Search Reviews"
      class="mx-4"
    ></v-text-field>
    <v-data-table
      :headers="reviewHeaders"
      :items="filteredReviews"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>

    <!-- 员工帖子表 -->
    <h2>Employee Daily Posts</h2>
    <v-text-field
      v-model="postSearch"
      label="Search Posts"
      class="mx-4"
    ></v-text-field>
    <v-data-table
      :headers="postHeaders"
      :items="filteredPosts"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

/* 客户评论的表头 */
const reviewHeaders = ref([
  { text: 'Name', value: 'name' },
  { text: 'Age', value: 'age' },
  { text: 'Region', value: 'region' },
  { text: 'Review', value: 'review' }
])

/* 员工日常帖子表的表头 */
const postHeaders = ref([
  { text: 'Name', value: 'name' },
  { text: 'Age', value: 'age' },
  { text: 'Region', value: 'region' },
  { text: 'Post Content', value: 'content' }
])

/* 客户评论数据 */
const reviews = ref([
  { name: 'Eleanor', age: 72, region: 'New York', review: 'The care and attention I receive here is truly remarkable.' },
  { name: 'Arthur', age: 65, region: 'California', review: 'The staff is so kind and helpful. This place feels like home.' },
  { name: 'Mildred', age: 80, region: 'Texas', review: 'I appreciate the recreational activities provided for seniors.' },
  { name: 'Harold', age: 75, region: 'Florida', review: 'The volunteers are friendly and always willing to help.' },
  { name: 'Gertrude', age: 68, region: 'Illinois', review: 'I enjoy spending time with others at the community events.' },
  { name: 'Walter', age: 77, region: 'Ohio', review: 'The health services here have greatly improved my wellbeing.' },
  { name: 'Betty', age: 69, region: 'New York', review: 'Its comforting to know theres always someone available when I need help.' },
  { name: 'Ralph', age: 73, region: 'Arizona', review: 'The exercise programs have helped me stay active and healthy.' },
  { name: 'Irene', age: 85, region: 'Florida', review: 'This is a wonderful place for seniors to connect and feel supported.' },
  { name: 'Fred', age: 82, region: 'Nevada', review: 'Ive made great friends here and feel part of a caring community.' },
  { name: 'Alice', age: 74, region: 'New Jersey', review: 'The staff makes sure I always have what I need.' },
  { name: 'George', age: 79, region: 'Michigan', review: 'This organization is making a real difference in the lives of seniors.' },
  { name: 'Clara', age: 70, region: 'North Carolina', review: 'I appreciate the educational programs offered here.' },
  { name: 'Leo', age: 76, region: 'Virginia', review: 'I feel respected and valued here, which means the world to me.' },
  { name: 'Dorothy', age: 78, region: 'Georgia', review: 'The social events help me stay engaged and active.' },
  { name: 'Edwin', age: 81, region: 'Colorado', review: 'I am grateful for the care and companionship provided here.' },
  { name: 'Mabel', age: 66, region: 'Oregon', review: 'The community dinners are my favorite part of the week.' },
  { name: 'Henry', age: 71, region: 'Washington', review: 'Ive regained my confidence thanks to the support here.' },
  { name: 'Florence', age: 83, region: 'Pennsylvania', review: 'The staff and volunteers go above and beyond to make us feel at home.' },
  { name: 'Louis', age: 67, region: 'Massachusetts', review: 'I have never felt more connected to others in my senior years.' }
])

/* 员工帖子数据 */
const posts = ref([
  { name: 'Anna', age: 45, region: 'New York', content: 'Today we organized a craft session for the seniors, and they absolutely loved it!' },
  { name: 'Michael', age: 38, region: 'California', content: 'We successfully hosted our weekly fitness class for seniors today.' },
  { name: 'Jessica', age: 29, region: 'Texas', content: 'Spent some time discussing health tips with seniors during todays wellness talk.' },
  { name: 'David', age: 50, region: 'Florida', content: 'Helped set up a social event, and everyone enjoyed the live music.' },
  { name: 'Sophia', age: 33, region: 'Illinois', content: 'We had a great turnout for our book reading session this afternoon.' },
  { name: 'Robert', age: 42, region: 'Ohio', content: 'Volunteering today at the dining hall. Love seeing the smiles on their faces!' },
  { name: 'Linda', age: 48, region: 'Arizona', content: 'Today we discussed mental health and relaxation techniques with the seniors.' },
  { name: 'John', age: 37, region: 'Florida', content: 'Led a walking group around the garden, and everyone was so energized!' },
  { name: 'Emily', age: 26, region: 'New Jersey', content: 'Our knitting workshop was a big hit with the seniors today.' },
  { name: 'Thomas', age: 55, region: 'Nevada', content: 'Worked on setting up a technology class to teach seniors how to use smartphones.' },
  { name: 'Sarah', age: 40, region: 'Michigan', content: 'Organized a group discussion on staying socially connected in senior years.' },
  { name: 'Daniel', age: 34, region: 'North Carolina', content: 'Helped a senior set up an online video call with their grandchildren today.' },
  { name: 'Karen', age: 46, region: 'Virginia', content: 'We had a lovely baking session with our residents this morning.' },
  { name: 'James', age: 41, region: 'Georgia', content: 'Our team planned a movie night for the seniors this weekend!' },
  { name: 'Laura', age: 30, region: 'Colorado', content: 'I taught a group of seniors how to do chair yoga today.' },
  { name: 'Peter', age: 39, region: 'Oregon', content: 'Spent the afternoon playing board games with some of our residents.' },
  { name: 'Nancy', age: 47, region: 'Washington', content: 'Organized a dance class for seniors, and it was so much fun!' },
  { name: 'Paul', age: 36, region: 'Pennsylvania', content: 'We had a special guest speaker discuss senior nutrition today.' },
  { name: 'Helen', age: 43, region: 'Massachusetts', content: 'Helped a resident create a family photo album.' },
  { name: 'Andrew', age: 32, region: 'New York', content: 'Coordinated a visit from a local school choir for a special performance.' }
])

/* 搜索框绑定值 */
const reviewSearch = ref('')
const postSearch = ref('')

/* 过滤后的客户评论 */
const filteredReviews = computed(() => {
  if (!reviewSearch.value) return reviews.value
  const search = reviewSearch.value.toLowerCase()
  return reviews.value.filter(review =>
    review.name.toLowerCase().includes(search) ||
    review.review.toLowerCase().includes(search) ||
    String(review.age).includes(search) ||
    review.region.toLowerCase().includes(search)
  )
})

/* 过滤后的员工帖子 */
const filteredPosts = computed(() => {
  if (!postSearch.value) return posts.value
  const search = postSearch.value.toLowerCase()
  return posts.value.filter(post =>
    post.name.toLowerCase().includes(search) ||
    post.content.toLowerCase().includes(search) ||
    String(post.age).includes(search) ||
    post.region.toLowerCase().includes(search)
  )
})
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>