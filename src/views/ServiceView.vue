<template>
  <div class="container mt-5">
    <h1 class="text-center mt-5 pt-5">Service Booking View</h1>
    <div id="serviceCards" class="row mt-3">
      <!-- Service Cards -->
      <div class="col-md-4 mb-3" v-for="service in services" :key="service.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ service.name }}</h5>
            <p class="card-text">{{ service.description }}</p>
            <button class="btn btn-primary" @click="selectService(service)">Book Now</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar only shows when a service is selected -->
    <div v-if="selectedService" class="mt-5 pt-5">
      <h3>Booking for: {{ selectedService.name }}</h3>
      <div ref="calendar"></div>
    </div>

    <!-- Interactive Chart Section -->
    <div class="mt-5 pt-5">
      <h3>Interactive Booking Stats</h3>
      <canvas id="bookingChart"></canvas> <!-- Chart container -->
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { doc, setDoc, updateDoc, increment, getDocs, collection, query, where } from 'firebase/firestore';
import { db, auth } from '@/main'; 

import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

export default {
  data() {
    return {
      services: [
        { id: 1, name: 'Health Support', description: 'Support for physical health issues.' },
        { id: 2, name: 'Mental Health', description: 'Counseling and support for mental health.' },
        { id: 3, name: 'Financial Assistance', description: 'Help with managing finances and aid.' },
        { id: 4, name: 'Online Learning', description: 'Access to online courses and educational resources.' },
        { id: 5, name: 'Community Activities', description: 'Engagement in community events and activities.' }
      ],
      selectedService: null,
      calendar: null,
      userId: null,
      events: [], 
      bookingStats: {}, 
      chartData: [], 
      bookingChart: null, 
      isChartRendered: false
    };
  },
  methods: {
    selectService(service) {
      this.selectedService = service;
      this.initializeCalendar();
    },
    async initializeCalendar() {
      const calendarEl = this.$refs.calendar;
      if (calendarEl && !this.calendar) {
        this.calendar = new Calendar(calendarEl, {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          selectable: true,
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          select: (selectionInfo) => {
            const isConflict = this.checkForBookingConflict(selectionInfo.start, selectionInfo.end);
            if (!isConflict) {
              alert(`Booking Confirmed for: ${this.selectedService.name}`);
              const newEvent = {
                title: this.selectedService.name,
                start: selectionInfo.start,
                end: selectionInfo.end,
                allDay: selectionInfo.allDay
              };
              this.calendar.addEvent(newEvent);
              this.saveBookingToFirestore(selectionInfo.start, selectionInfo.end);
            } else {
              alert('Booking conflict detected! Please choose a different time.');
            }
          },
          events: this.events 
        });

        this.calendar.render();
      }
    },
    checkForBookingConflict(start, end) {
      const events = this.calendar.getEvents();
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if ((start >= event.start && start < event.end) || (end > event.start && end <= event.end)) {
          return true;
        }
      }
      return false;
    },
    async saveBookingToFirestore(start, end) {
      try {
        const user = auth.currentUser;
        if (user) {
          this.userId = user.uid;
          const bookingRef = doc(db, 'bookings', `${this.userId}_${this.selectedService.id}_${start.toISOString()}`);
          await setDoc(bookingRef, {
            userId: this.userId,
            serviceId: this.selectedService.id,
            serviceName: this.selectedService.name,
            bookingStart: start, 
            bookingEnd: end
          });
          console.log('Booking saved to Firestore');

          const serviceRef = doc(db, 'services', this.selectedService.id.toString());
          await updateDoc(serviceRef, {
            bookCount: increment(1)
          });

          this.updateBookingStats(this.selectedService.name);
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    },
    async fetchBookingsFromFirestore() {
      try {
        const user = auth.currentUser;
        if (user) {
          this.userId = user.uid;
          const bookingsQuery = query(
            collection(db, 'bookings'),
            where('userId', '==', this.userId)
          );
          const querySnapshot = await getDocs(bookingsQuery);
          const newEvents = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.bookingStart && data.bookingEnd) {
              newEvents.push({
                title: data.serviceName,
                start: data.bookingStart instanceof Date ? data.bookingStart : data.bookingStart.toDate(),
                end: data.bookingEnd instanceof Date ? data.bookingEnd : data.bookingEnd.toDate(),
                allDay: true
              });
              this.updateBookingStats(data.serviceName, false);
            }
          });
          this.events = newEvents;
          if (this.calendar) {
            this.calendar.addEventSource(this.events);
          }
          nextTick(() => {
            this.renderBookingChart();
          });
        }
      } catch (error) {
        console.error('Error fetching bookings from Firestore:', error);
      }
    },
    updateBookingStats(serviceName, shouldUpdateChart = true) {
      if (!this.bookingStats[serviceName]) {
        this.bookingStats[serviceName] = 0;
      }
      this.bookingStats[serviceName]++;
      this.chartData = Object.values(this.bookingStats);
      if (this.bookingChart && shouldUpdateChart) {
        this.bookingChart.data.datasets[0].data = this.chartData;
        this.bookingChart.update();
      }
    },
    renderBookingChart() {
      const ctx = document.getElementById('bookingChart').getContext('2d');
      if (!this.isChartRendered) {
        this.bookingChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(this.bookingStats),
            datasets: [{
              label: 'Number of Bookings',
              data: this.chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        this.isChartRendered = true;
      } else {
        this.bookingChart.data.labels = Object.keys(this.bookingStats);
        this.bookingChart.update();
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        this.fetchBookingsFromFirestore();
      } else {
        this.userId = null;
      }
    });
  }
};
</script>

<style>
@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/fullcalendar@6.1.4/index.global.min.css');
</style>
