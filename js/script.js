class TodoApp {
    constructor() {
        this.tasks = [];
        this.filter = 'all';
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.updateStats();
        this.renderTasks();
    }
    
    initializeElements() {
        // Input elements
        this.newTaskInput = document.getElementById('newTaskInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.searchInput = document.getElementById('searchInput');
        
        // Button elements
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        
        // Display elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.progressPercentageEl = document.getElementById('progressPercentage');
        this.tasksListEl = document.getElementById('tasksList');

        // Dropdown
        this.filterDropdown = document.getElementById('filterDropdown');
    }
    
    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Search event
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderTasks();
        });
        

        // Filter dropdown toggle
        this.filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFilterDropdown();
        });

        // Dropdown item click
        if (this.filterDropdown) {
            this.filterDropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('dropdown-item')) {
                    const filter = e.target.getAttribute('data-filter');
                    this.setFilter(filter);
                    this.hideFilterDropdown();
                }
            });
        }

        // Hide dropdown on outside click
        document.addEventListener('click', (e) => {
            if (this.filterDropdown && this.filterDropdown.style.display === 'block') {
                if (!this.filterDropdown.contains(e.target) && e.target !== this.filterBtn) {
                    this.hideFilterDropdown();
                }
            }
        });
        
        // Delete all event
        this.deleteAllBtn.addEventListener('click', () => this.deleteAllTasks());
        
        // Keyboard shortcut for search
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }
    
    addTask() {
        const taskText = this.newTaskInput.value.trim();
        const date = this.dueDateInput.value.trim();
        if (taskText === "" && date === "") {
            alert('hayoo, masih kosong nih, kegiatan dan tanggalnya :v');
        } else if (taskText === "") {
            alert('masukan kegiatannya dulu, jangan lupa ya :D');
        } else if (date === "") {
            alert('masukan tanggalnya dulu, jangan lupa ya :D');
        } else {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                dueDate: date,
                createdAt: new Date()
            };
            this.tasks.push(task);
            this.newTaskInput.value = '';
            this.dueDateInput.value = '';
            this.updateStats();
            this.renderTasks();
        }
        
    }
    
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.updateStats();
            this.renderTasks();
        }
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.updateStats();
        this.renderTasks();
    }
    
    deleteAllTasks() {
        if (this.tasks.length === 0) return;
        
        if (confirm('apakah kamu yakin ingin menghapus semua kegiatan?')) {
            this.tasks = [];
            this.updateStats();
            this.renderTasks();
        }
    }
    
    toggleFilterDropdown() {
        if (!this.filterDropdown) return;
        if (this.filterDropdown.style.display === 'block') {
            this.filterDropdown.style.display = 'none';
        } else {
            // Position dropdown always below the button
            this.filterDropdown.style.display = 'block';
            const btnRect = this.filterBtn.getBoundingClientRect();
            const parentRect = this.filterBtn.offsetParent ? this.filterBtn.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
            this.filterDropdown.style.left = (btnRect.left - parentRect.left) + 'px';
            this.filterDropdown.style.top = (btnRect.bottom - parentRect.top + 4) + 'px';
        }
    }

    hideFilterDropdown() {
        if (this.filterDropdown) {
            this.filterDropdown.style.display = 'none';
        }
    }

    setFilter(filter) {
        this.filter = filter;
        this.renderTasks();
        // Update button text
        let filterText = 'FILTER';
        if (filter === 'completed') filterText = 'COMPLETED';
        else if (filter === 'pending') filterText = 'PENDING';
        this.filterBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            ${filterText}
        `;
    }
    
    getFilteredTasks() {
        let filtered = this.tasks;
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(task => 
                task.text.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (this.filter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        } else if (this.filter === 'pending') {
            filtered = filtered.filter(task => !task.completed);
        }
        
        return filtered;
    }
    
    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        this.totalTasksEl.textContent = totalTasks;
        this.completedTasksEl.textContent = completedTasks;
        this.pendingTasksEl.textContent = pendingTasks;
        this.progressPercentageEl.textContent = `${progressPercentage}%`;
    }
    
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.tasksListEl.innerHTML = `
                <div class="no-tasks">
                    ${this.tasks.length === 0 ? 'No tasks found' : 'No tasks match your search'}
                </div>
            `;
            return;
        }
        
        this.tasksListEl.innerHTML = filteredTasks.map(task => {
            if (task.editing) {
                return `
                <div class="task-row">
                    <div class="task-cell">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="todoApp.toggleTask(${task.id})">
                        <input type="text" class="edit-task-input" id="editTaskInput${task.id}" value="${this.escapeHtml(task.text)}" style="width:60%"> 
                    </div>
                    <div class="task-cell task-date">
                        <input type="date" class="edit-date-input" id="editDateInput${task.id}" value="${task.dueDate || ''}">
                    </div>
                    <div class="task-cell">
                        <span class="status-badge ${task.completed ? 'completed' : 'pending'}">
                            ${task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                    <div class="task-cell">
                        <button class="save-task-btn" onclick="todoApp.saveEditTask(${task.id})">Save</button>
                        <button class="cancel-task-btn" onclick="todoApp.cancelEditTask(${task.id})">Cancel</button>
                    </div>
                </div>
                `;
            } else {
                return `
                <div class="task-row">
                    <div class="task-cell">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="todoApp.toggleTask(${task.id})">
                        <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                    </div>
                    <div class="task-cell task-date">
                        ${task.dueDate || '-'}
                    </div>
                    <div class="task-cell">
                        <span class="status-badge ${task.completed ? 'completed' : 'pending'}">
                            ${task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                    <div class="task-cell">
                        <button class="edit-task-btn" onclick="todoApp.editTask(${task.id})">Edit</button>
                        <button class="delete-task-btn" onclick="todoApp.deleteTask(${task.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                `;
            }
        }).join('');
    }

    editTask(id) {
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, editing: true } : { ...t, editing: false });
        this.renderTasks();
        setTimeout(() => {
            const input = document.getElementById('editTaskInput' + id);
            if (input) input.focus();
        }, 0);
    }

    saveEditTask(id) {
        const input = document.getElementById('editTaskInput' + id);
        const dateInput = document.getElementById('editDateInput' + id);
        const newText = input ? input.value.trim() : '';
        const newDate = dateInput ? dateInput.value : '';
        if (newText === '') {
            alert('Task tidak boleh kosong!');
            return;
        }
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, text: newText, dueDate: newDate, editing: false } : t);
        this.renderTasks();
    }

    cancelEditTask(id) {
        this.tasks = this.tasks.map(t => t.id === id ? { ...t, editing: false } : t);
        this.renderTasks();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});