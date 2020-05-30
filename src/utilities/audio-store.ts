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

export const storeSaveAudio = (audio: File, category: String, originalName: String) => {
    // @ts-ignore
    console.log(originalName)
    window.audioStore[category].audioList.push({
        file: audio,
        name: originalName
    })
}

export const storeGetData = () => {
    return {
        ...window.audioStore
    }
}
