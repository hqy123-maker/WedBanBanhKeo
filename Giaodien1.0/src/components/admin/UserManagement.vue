<template>
  <div class="container">
    <h2 class="title">Quản lý người dùng</h2>
    <button @click="showAddUserForm" class="btn-add">Thêm người dùng</button>

    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Email</th>
          <th>Vai trò</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name || "Chưa cập nhật" }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>
            <button @click="editUser(index)" class="btn-edit">Sửa</button>
            <button @click="deleteUser(index)" class="btn-delete">Xóa</button>
            <button @click="toggleStatus(index)" class="btn-status">
              {{ user.status === "Hoạt động" ? "Khóa" : "Mở khóa" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingIndex !== null ? "Chỉnh sửa người dùng" : "Thêm người dùng" }}</h3>
        <input type="text" v-model="newUser.name" placeholder="Tên người dùng" />
        <input type="email" v-model="newUser.email" placeholder="Email" />
        <input type="password" v-model="newUser.password" placeholder="Mật khẩu" v-if="editingIndex === null" />
        <select v-model="newUser.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button @click="saveUser">Lưu</button>
        <button @click="showForm = false">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const users = ref([]);
    const showForm = ref(false);
    const newUser = ref({ name: "", email: "", password: "", role: "user" });
    const editingIndex = ref(null);

    const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(response.data); 
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
  }
};
    const showAddUserForm = () => {
      newUser.value = { name: "", email: "", password: "", role: "user" };
      editingIndex.value = null;
      showForm.value = true;
    };

    const saveUser = async () => {
      try {
        if (editingIndex.value !== null) {
          await axios.put(`http://localhost:5000/api/users/${users.value[editingIndex.value].id}`, newUser.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
        } else {
          await axios.post("http://localhost:5000/api/users/register", newUser.value);
        }
        fetchUsers();
        showForm.value = false;
      } catch (error) {
        console.error("Lỗi khi lưu người dùng:", error);
      }
    };

    const editUser = (index) => {
      newUser.value = { ...users.value[index], password: "" };
      editingIndex.value = index;
      showForm.value = true;
    };

    const deleteUser = async (index) => {
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        try {
          await axios.delete(`http://localhost:5000/api/users/${users.value[index].id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          fetchUsers();
        } catch (error) {
          console.error("Lỗi xóa người dùng:", error);
        }
      }
    };

    const toggleStatus = async (index) => {
  try {
    const userId = users.value[index].id;
    await axios.patch(
      `http://localhost:5000/api/admin/users/${userId}/toggle-status`,
      {}, // Body rỗng để tránh lỗi
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    console.log("Trước khi cập nhật:", users.value[index]);
    await fetchUsers(); // Đợi cập nhật danh sách mới
    console.log("Sau khi cập nhật:", users.value[index]);
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái người dùng:", error.response?.data || error.message);
    alert("Không thể cập nhật trạng thái người dùng, vui lòng thử lại.");
  }
};
    onMounted(fetchUsers);

    return { users, showForm, newUser, editingIndex, saveUser, editUser, deleteUser, showAddUserForm, toggleStatus };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
}

.btn-add {
  margin-bottom: 10px;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.btn-edit {
  background: #ffc107;
  color: black;
  padding: 5px;
  margin: 2px;
  border: none;
  cursor: pointer;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 5px;
  margin: 2px;
  border: none;
  cursor: pointer;
}

.btn-status {
  background: #17a2b8;
  color: white;
  padding: 5px;
  margin: 2px;
  border: none;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
}

.modal input,
.modal select {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}

.modal button {
  margin: 5px;
  padding: 8px;
}
</style>
