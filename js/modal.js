document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("thanks-modal");
    const closeButtons = [
        document.getElementById("modal-close"),
        document.getElementById("modal-ok")
    ];

    function closeModal() {
        modal.style.display = "none";
    }

    closeButtons.forEach(button => {
        button.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});