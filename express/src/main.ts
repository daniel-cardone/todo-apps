type TaskStatus = "in progress" | "complete";

(function() {
    const userBtns = document.querySelectorAll("button.user") as NodeListOf<HTMLButtonElement>;
    const itemCountSpan = document.querySelector("#itemCount") as HTMLSpanElement;
    const itemInput = document.querySelector("#itemInput") as HTMLInputElement;
    const addItemBtn = document.querySelector("#addItemBtn") as HTMLButtonElement;
    const infoTextP = document.querySelector("#infoText") as HTMLParagraphElement;
    const todoListContainer = document.querySelector("#todoList") as HTMLDivElement;

    window.onload = () => {
        const totalItems = 0;
        itemCountSpan.textContent = totalItems.toString();

        switchActiveUser("user1");
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
    }

    function createTask(taskName: string) {
        if (taskName.length < 1) return;

        const taskStatus = "in progress";
        const date = Date.now();
        prependNewTask(taskName, taskStatus, date);
        fetch("/create", {
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
            })
    }

    function prependNewTask(taskName: string, status: TaskStatus, date: number) {
        const todoListItem = document.createElement("div");
        todoListItem.classList.add("todo-item");
        todoListItem.innerHTML = `
            <h3>${taskName}</h3>
            <span class="status-indicator">${status}</span>
            <p class="task-date">${new Date(date).toLocaleDateString()}</p>
        `;
        todoListContainer.prepend(todoListItem);
    }

    userBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            switchActiveUser(btn.dataset.username);
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
