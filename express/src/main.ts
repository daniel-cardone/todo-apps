type TaskStatus = "in progress" | "complete";
type TaskUpdateMethod = "complete" | "delete" | "reset";

(function() {
    const userBtns = document.querySelectorAll("button.user") as NodeListOf<HTMLButtonElement>;
    const filterBtns = document.querySelectorAll(".filter button") as NodeListOf<HTMLButtonElement>;
    const itemCountSpan = document.querySelector("#itemCount") as HTMLSpanElement;
    const itemInput = document.querySelector("#itemInput") as HTMLInputElement;
    const addItemBtn = document.querySelector("#addItemBtn") as HTMLButtonElement;
    const infoTextP = document.querySelector("#infoText") as HTMLParagraphElement;
    const todoListContainer = document.querySelector("#todoList") as HTMLDivElement;
    let totalItems = 0;

    window.onload = () => {
        updateItemCount();
        switchActiveUser("user1");
    }

    function updateItemCount() {
        itemCountSpan.textContent = totalItems.toString();
    }

    function switchActiveUser(username?: string) {
        if (!username) return;

        userBtns.forEach(btn => {
            if (btn.dataset.username === username) {
                btn.classList.add("active");
                localStorage.setItem("username", username);
            } else {
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
            })
    }

    function createTask(taskName: string) {
        if (taskName.length < 1) return;

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

    function prependNewTask(taskName: string, taskStatus: TaskStatus, date: number, taskId?: string) {
        const todoListItem = document.createElement("div");
        let completeBtnExtraClass = "";
        let resetBtnExtraClass = "hidden";
        if (taskStatus === "complete") {
            completeBtnExtraClass = "hidden";
            resetBtnExtraClass = "";
        } else {
            totalItems++;
            updateItemCount();
        }

        if (taskId) {
            todoListItem.dataset.taskId = taskId;
        }

        todoListItem.classList.add("todo-item", taskStatus.replace(" ", "-"));
        todoListItem.innerHTML = `
            <p class="status-indicator">${taskStatus}</p>
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

        const completeBtn = todoListItem.querySelector(".task-complete-btn") as HTMLButtonElement;
        const resetBtn = todoListItem.querySelector(".task-reset-btn") as HTMLButtonElement;
        const editBtn = todoListItem.querySelector(".task-edit-btn") as HTMLButtonElement;
        const deleteBtn = todoListItem.querySelector(".task-delete-btn") as HTMLButtonElement;

        completeBtn.addEventListener("click", () => {
            const statusIndicator = todoListItem.querySelector(".status-indicator") as HTMLParagraphElement;
            todoListItem.classList.remove("in-progress");
            todoListItem.classList.add("complete");
            statusIndicator.textContent = "complete";
            resetBtn.classList.remove("hidden");
            completeBtn.classList.add("hidden");

            updateTask(todoListItem, "complete");

            totalItems--;
            updateItemCount();
        });

        resetBtn.addEventListener("click", () => {
            const statusIndicator = todoListItem.querySelector(".status-indicator") as HTMLParagraphElement;
            todoListItem.classList.remove("complete");
            todoListItem.classList.add("in-progress");
            statusIndicator.textContent = "in progress";
            completeBtn.classList.remove("hidden");
            resetBtn.classList.add("hidden");

            updateTask(todoListItem, "reset");

            totalItems++;
            updateItemCount();
        });

        editBtn.addEventListener("click", () => {
            const h3 = todoListItem.querySelector("h3") as HTMLHeadingElement;
            h3.innerHTML = `
                <div class="task-input-container flex-row">
                    <input value="${h3.textContent}" maxlength="100" />
                    <button>Update</button>
                </div>
            `;

            const newValueInput = h3.querySelector("input") as HTMLInputElement;
            const updateBtn = h3.querySelector("button") as HTMLButtonElement;
            updateBtn.addEventListener("click", () => {
                if (newValueInput.value.length < 1) return;

                h3.textContent = newValueInput.value;
                renameTask(todoListItem, h3.textContent);
            });
        });

        deleteBtn.addEventListener("click", () => {
            updateTask(todoListItem, "delete");

            if (todoListItem.classList.contains("in-progress")) {
                totalItems--;
                updateItemCount();
            }

            todoListItem.remove();
        });

        return todoListItem;
    }

    function updateTask(element: HTMLDivElement, taskUpdateMethod: TaskUpdateMethod) {
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

    function renameTask(element: HTMLDivElement, taskName: string) {
        fetch("/rename", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                taskId: element.dataset.taskId,
                taskName
            })
        })
            .then(res => {
                if (res.status !== 200) {
                    infoTextP.textContent = "There was an error editing your TODO item.";
                    infoTextP.classList.remove("success");
                    return;
                }

                infoTextP.textContent = "TODO item renamed!";
                infoTextP.classList.add("success");
            });
    }

    userBtns.forEach(btn => {
        btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;
            switchActiveUser(btn.dataset.username);
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            todoListContainer.classList.remove(...todoListContainer.classList);
            todoListContainer.classList.add(btn.dataset.filter || "");
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
