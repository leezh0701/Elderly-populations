// src/store.js
import { createStore } from 'vuex'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

export default createStore({
  state: {
    user: null,
    reviews: [],
    posts: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    },
    setReviews(state, reviews) {
      state.reviews = reviews
    },
    setPosts(state, posts) {
      state.posts = posts
    }
  },
  actions: {
    async fetchReviews({ commit }) {
      const db = getFirestore()
      const reviewsCollection = collection(db, 'reviews') 
      const reviewSnapshot = await getDocs(reviewsCollection)
      const reviews = reviewSnapshot.docs.map(doc => doc.data())
      commit('setReviews', reviews)
    },
    async fetchPosts({ commit }) {
      const db = getFirestore()
      const postsCollection = collection(db, 'posts') 
      const postSnapshot = await getDocs(postsCollection)
      const posts = postSnapshot.docs.map(doc => doc.data())
      commit('setPosts', posts)
    },
    async logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    userRole: state => state.user ? state.user.role : null,
    getReviews: state => state.reviews,
    getPosts: state => state.posts
  }
})
