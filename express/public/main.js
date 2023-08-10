"use strict";
(function () {
    const userBtns = document.querySelectorAll("button.user");
    const filterBtns = document.querySelectorAll(".filter button");
    const itemCountSpan = document.querySelector("#itemCount");
    const itemInput = document.querySelector("#itemInput");
    const addItemBtn = document.querySelector("#addItemBtn");
    const infoTextP = document.querySelector("#infoText");
    const todoListContainer = document.querySelector("#todoList");
    let totalItems = 0;
    window.onload = () => {
        updateItemCount();
        switchActiveUser("user1");
    };
    function updateItemCount() {
        itemCountSpan.textContent = totalItems.toString();
    }
    function switchActiveUser(username) {
        if (!username)
            return;
        userBtns.forEach(btn => {
            if (btn.dataset.username === username) {
                btn.classList.add("active");
                localStorage.setItem("username", username);
            }
            else {
                btn.classList.remove("active");
            }
        });
        while (todoListContainer.firstChild) {
            todoListContainer.firstChild.remove();
        }
        totalItems = 0;
        updateItemCount();
        fetch(`/tasks/${localStorage.getItem("username")}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
            .then(res => res.json())
            .then(data => {
            for (const taskId in data) {
                const { taskName, taskStatus, date } = data[taskId];
                prependNewTask(taskName, taskStatus, date, taskId);
            }
        });
    }
    function createTask(taskName) {
        if (taskName.length < 1)
            return;
        const taskStatus = "in progress";
        const date = Date.now();
        const todoElement = prependNewTask(taskName, taskStatus, date);
        fetch("/create", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                taskName,
                taskStatus,
                date
            })
        })
            .then(res => {
            if (res.status !== 200) {
                infoTextP.textContent = "There was an error saving your TODO item.";
                infoTextP.classList.remove("success");
                return;
            }
            infoTextP.textContent = "TODO item added!";
            infoTextP.classList.add("success");
            itemInput.value = "";
            res.text().then(taskId => todoElement.dataset.taskId = taskId);
        });
    }
    function prependNewTask(taskName, taskStatus, date, taskId) {
        const todoListItem = document.createElement("div");
        let completeBtnExtraClass = "";
        let resetBtnExtraClass = "hidden";
        if (taskStatus === "complete") {
            completeBtnExtraClass = "hidden";
            resetBtnExtraClass = "";
        }
        else {
            totalItems++;
            updateItemCount();
        }
        if (taskId) {
            todoListItem.dataset.taskId = taskId;
        }
        todoListItem.classList.add("todo-item");
        todoListItem.innerHTML = `
            <p class="status-indicator ${taskStatus.replace(" ", "-")}">${taskStatus}</p>
            <h3>${taskName}</h3>
            <div class="task-options">
                <div class="flex-row">
                    <button class="task-complete-btn ${completeBtnExtraClass}">Complete</button>
                    <button class="task-reset-btn ${resetBtnExtraClass}">Reset</button>
                    <button class="task-edit-btn">Edit</button>
                    <button class="task-delete-btn">Delete</button>
                </div>
                <p class="task-date">${new Date(date).toLocaleDateString()}</p>
            </div>
        `;
        todoListContainer.prepend(todoListItem);
        const completeBtn = todoListItem.querySelector(".task-complete-btn");
        const resetBtn = todoListItem.querySelector(".task-reset-btn");
        const editBtn = todoListItem.querySelector(".task-edit-btn");
        const deleteBtn = todoListItem.querySelector(".task-delete-btn");
        completeBtn.addEventListener("click", () => {
            const statusIndicator = todoListItem.querySelector(".status-indicator");
            statusIndicator.classList.remove("in-progress");
            statusIndicator.classList.add("complete");
            statusIndicator.textContent = "complete";
            resetBtn.classList.remove("hidden");
            completeBtn.classList.add("hidden");
            updateTask(todoListItem, "complete");
            totalItems--;
            updateItemCount();
        });
        resetBtn.addEventListener("click", () => {
            const statusIndicator = todoListItem.querySelector(".status-indicator");
            statusIndicator.classList.remove("complete");
            statusIndicator.classList.add("in-progress");
            statusIndicator.textContent = "in progress";
            completeBtn.classList.remove("hidden");
            resetBtn.classList.add("hidden");
            updateTask(todoListItem, "reset");
            totalItems++;
            updateItemCount();
        });
        editBtn.addEventListener("click", () => {
        });
        deleteBtn.addEventListener("click", () => {
            var _a;
            updateTask(todoListItem, "delete");
            if ((_a = todoListItem.querySelector(".status-indicator")) === null || _a === void 0 ? void 0 : _a.classList.contains("in-progress")) {
                totalItems--;
                updateItemCount();
            }
            todoListItem.remove();
        });
        return todoListItem;
    }
    function updateTask(element, taskUpdateMethod) {
        fetch(`/${taskUpdateMethod}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                taskId: element.dataset.taskId
            })
        })
            .then(res => {
            if (res.status !== 200) {
                infoTextP.textContent = "There was an error updating your TODO item.";
                infoTextP.classList.remove("success");
                return;
            }
            infoTextP.textContent = "TODO item updated!";
            infoTextP.classList.add("success");
        });
    }
    userBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("active"))
                return;
            switchActiveUser(btn.dataset.username);
        });
    });
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            for (const child of todoListContainer.children) {
                const statusP = child.querySelector(".status-indicator");
                const filterType = btn.dataset.filter || "";
                if (filterType === "") {
                    child.classList.remove("hidden");
                    continue;
                }
                if (statusP.classList.contains(filterType)) {
                    child.classList.remove("hidden");
                }
                else {
                    child.classList.add("hidden");
                }
            }
        });
    });
    itemInput.addEventListener("keydown", () => {
        infoTextP.textContent = "";
    });
    addItemBtn.addEventListener("click", () => {
        const taskName = itemInput.value;
        createTask(taskName);
    });
})();
