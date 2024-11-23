<template>
    <q-page class="bg-grey-3 column">
      <!-- Task Input -->
      <div class="row q-pa-sm bg-primary">
        <q-input
          v-model="newTask"
          @keyup.enter="addTask"
          class="col"
          square
          filled
          bg-color="white"
          placeholder="Add task"
          dense
        >
          <template v-slot:append>
            <q-btn @click="addTask" round dense flat icon="add" />
          </template>
        </q-input>
      </div>
  
      <!-- Task List -->
      <q-list class="bg-white" separator bordered>
        <q-item
          v-for="(task, index) in tasks"
          :key="task.key"
          @click="updateTask(task, task.key)"
          :class="{ 'done bg-blue-1': task.done }"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-checkbox v-model="task.done" class="no-pointer-events" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ task.title }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="task.done" side>
            <q-btn
              @click.stop="deleteTask(index, task.key)"
              round
              dense
              color="primary"
              icon="delete"
            />
          </q-item-section>
        </q-item>
      </q-list>
  
      <!-- No Tasks Message -->
      <div v-if="!tasks.length" class="no-tasks absolute-center">
        <q-icon name="check" size="100px" color="primary" />
        <div class="text-h5 text-primary text-center">No tasks</div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import db from "../firebaseDb";
  
  export default defineComponent({
    name: "TodoPage", // Multi-word name for component (as per ESLint rules)
    data() {
      return {
        newTask: "",
        tasks: [],
      };
    },
  
    created() {
      // Firebase real-time updates
      db.collection("ToDoItems").onSnapshot((snapshotChange) => {
        this.tasks = snapshotChange.docs.map((doc) => ({
          key: doc.id,
          title: doc.data().title,
          done: doc.data().done,
        }));
      });
    },
  
    methods: {
      // Add a new task
      addTask() {
        if (this.newTask.trim() === "") {
          this.$q.notify({ type: "negative", message: "Task cannot be empty" });
          return;
        }
        const task = { title: this.newTask.trim(), done: false };
        db.collection("ToDoItems")
          .add(task)
          .then(() => {
            this.$q.notify({ type: "positive", message: "Task added!" });
            this.newTask = "";
          })
          .catch((error) => console.error("Error adding task:", error));
      },
  
      // Update task completion
      updateTask(task, id) {
        const updatedTask = { ...task, done: !task.done };
        db.collection("ToDoItems")
          .doc(id)
          .update(updatedTask)
          .then(() => this.$q.notify({ type: "positive", message: "Task updated!" }))
          .catch((error) => console.error("Error updating task:", error));
      },
  
      // Delete a task
      deleteTask(index, id) {
        this.$q
          .dialog({
            title: "Confirm",
            message: "Are you sure you want to delete this task?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            db.collection("ToDoItems")
              .doc(id)
              .delete()
              .then(() => {
                this.$q.notify({ type: "positive", message: "Task deleted!" });
              })
              .catch((error) => console.error("Error deleting task:", error));
          });
      },
    },
  });
  </script>
  
  <style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }
  
  .no-tasks {
    opacity: 0.5;
  }
  </style>
  