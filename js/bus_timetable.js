function showBus(id, button) {
    document.querySelectorAll('.bus-timetable')
        .forEach(section => section.hidden = true);

    document.getElementById(id).hidden = false;

    document.querySelectorAll('.bus-tabs button')
        .forEach(btn => btn.classList.remove('active'));

    button.classList.add('active');
}