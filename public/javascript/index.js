window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('#start')
    const sprintNameForm = document.querySelector('#sprint-name-form')

    function start() {
        this.classList.add('hidden')
        sprintNameForm.classList.remove('hidden')
    }

    startBtn.addEventListener('click', start)
})
