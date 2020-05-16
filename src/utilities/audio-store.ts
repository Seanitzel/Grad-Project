export const initAudioStore = function () {
    // @ts-ignore
    window.audioStore = {
        // TODO: add more categories
        stems: {
            icon: require('../assets/audio store/stems.svg'),
            title: 'Stems',
            audioList: []
        }
    }
}

export const storeSaveAudio = (audio: File, category: String) => {
    // @ts-ignore
    window.audioStore[category].audioList.push(audio)
}

export const storeGetData = () => {
    return {
        ...window.audioStore
    }
}
