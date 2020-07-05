window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('#start')
    const sprintNameForm = document.querySelector('#sprint-name-form')

    function start() {
        this.classList.add('d-none')
        sprintNameForm.classList.remove('d-none')
    }

    startBtn.addEventListener('click', start)
})
