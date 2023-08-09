(function() {
    const userBtns = document.querySelectorAll("button.user") as NodeListOf<HTMLButtonElement>;
    const itemCountSpan = document.querySelector("#itemCount") as HTMLSpanElement;
    const itemInput = document.querySelector("#itemInput") as HTMLInputElement;
    const addItemBtn = document.querySelector("#addItemBtn") as HTMLButtonElement;

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
        fetch("/create", {
            method: "POST",
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                taskName
            })
        })
    }

    function prependNewTask(taskName: string) {

    }

    userBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            switchActiveUser(btn.dataset.username);
        });
    });

    addItemBtn.addEventListener("click", () => {
        const taskName = itemInput.value;
        createTask(taskName);
    });
})();
